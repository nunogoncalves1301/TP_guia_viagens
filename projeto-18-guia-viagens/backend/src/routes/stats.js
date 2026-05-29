const express = require("express");
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");
const { getContinent } = require("../utils/continents");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const destinations = await prisma.destination.findMany({
      where: { userId: Number(req.user.id) },
      select: { country: true, rating: true, visitDate: true },
    });
    const countries = new Set(destinations.map((d) => d.country));
    const continents = new Set(destinations.map((d) => getContinent(d.country)));

    const ratings = destinations.filter((d) => d.rating).map((d) => d.rating);
    const avgRating =
      ratings.length > 0
        ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1)
        : null;

    const byCountry = {};
    destinations.forEach((d) => {
      byCountry[d.country] = (byCountry[d.country] || 0) + 1;
    });

    const byYear = {};
    destinations.forEach((d) => {
      const year = new Date(d.visitDate).getFullYear();
      byYear[year] = (byYear[year] || 0) + 1;
    });

    res.status(200).json({
      data: {
        totalDestinations: destinations.length,
        totalCountries: countries.size,
        totalContinents: continents.size,
        countries: [...countries],
        continents: [...continents],
        averageRating: avgRating,
        byCountry,
        byYear,
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
