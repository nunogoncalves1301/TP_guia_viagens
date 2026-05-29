const express = require("express");
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/", async (req, res, next) => {
  try {
    const rows = await prisma.destination.findMany({
      where: {
        isPublic: true,
        userId: { not: Number(req.user.id) },
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        country: true,
        city: true,
        visitDate: true,
        description: true,
        rating: true,
        latitude: true,
        longitude: true,
        createdAt: true,
        user: { select: { name: true } },
        photos: { select: { id: true, filename: true } },
        _count: { select: { experiences: true } },
      },
    });

    const data = rows.map((d) => ({
      id: d.id,
      country: d.country,
      city: d.city,
      visit_date: d.visitDate,
      description: d.description,
      rating: d.rating,
      latitude: d.latitude,
      longitude: d.longitude,
      created_at: d.createdAt,
      author_name: d.user.name,
      photos: d.photos,
      experience_count: d._count.experiences,
    }));

    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const dest = await prisma.destination.findFirst({
      where: { id, isPublic: true },
      include: {
        user: { select: { name: true } },
        photos: { orderBy: { id: "asc" } },
        experiences: { orderBy: { id: "asc" } },
      },
    });

    if (!dest) {
      return res.status(404).json({ message: "Destino público não encontrado" });
    }

    res.status(200).json({
      data: {
        ...(() => {
          const { user, ...rest } = dest;
          return { ...rest, author_name: user.name };
        })(),
      },
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
