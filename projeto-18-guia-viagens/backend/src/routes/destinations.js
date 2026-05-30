const express = require("express");
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

async function getDestinationWithDetails(id, userId) {
  const destinationId = Number(id);
  if (!Number.isFinite(destinationId)) return null;

  const dest = await prisma.destination.findFirst({
    where: { id: destinationId, userId: Number(userId) },
    include: {
      user: { select: { name: true } },
      photos: { orderBy: { id: "asc" } },
      experiences: { orderBy: { id: "asc" } },
    },
  });
  if (!dest) return null;

  const { user, photos, experiences, visitDate, ...rest } = dest;
  return {
    ...rest,
    visit_date: visitDate,
    author_name: user.name,
    photos,
    experiences,
  };
}

router.get("/", async (req, res, next) => {
  try {
    const rows = await prisma.destination.findMany({
      where: { userId: Number(req.user.id) },
      orderBy: { visitDate: "desc" },
      include: {
        _count: { select: { photos: true, experiences: true } },
      },
    });

    const data = rows.map(({ _count, visitDate, ...d }) => ({
      ...d,
      visit_date: visitDate,
      photo_count: _count.photos,
      experience_count: _count.experiences,
    }));

    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const data = await getDestinationWithDetails(req.params.id, req.user.id);
    if (!data) {
      return res.status(404).json({ message: "Destino não encontrado" });
    }
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { country, city, visit_date, description, rating, is_public, latitude, longitude } =
      req.body;

    if (!country || !city || !visit_date) {
      return res.status(400).json({
        message: "País, cidade e data de visita são obrigatórios",
      });
    }

    const created = await prisma.destination.create({
      data: {
        userId: Number(req.user.id),
        country,
        city,
        visitDate: new Date(visit_date),
        description: description || null,
        rating: rating ?? null,
        isPublic: Boolean(is_public),
        latitude: latitude ?? null,
        longitude: longitude ?? null,
      },
    });
    const { visitDate, ...createdRest } = created;
    res.status(201).json({ data: { ...createdRest, visit_date: visitDate } });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { country, city, visit_date, description, rating, is_public, latitude, longitude } =
      req.body;

    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const owned = await prisma.destination.findFirst({
      where: { id, userId: Number(req.user.id) },
      select: { id: true },
    });
    if (!owned) {
      return res.status(404).json({ message: "Destino não encontrado" });
    }

    const updated = await prisma.destination.update({
      where: { id },
      data: {
        country: country ?? undefined,
        city: city ?? undefined,
        visitDate: visit_date ? new Date(visit_date) : undefined,
        description: description ?? undefined,
        rating: rating ?? undefined,
        isPublic: typeof is_public === "boolean" ? is_public : undefined,
        latitude: latitude ?? undefined,
        longitude: longitude ?? undefined,
        updatedAt: new Date(),
      },
    });

    const { visitDate, ...updatedRest } = updated;
    res.status(200).json({ data: { ...updatedRest, visit_date: visitDate } });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const deleted = await prisma.destination.deleteMany({
      where: { id, userId: Number(req.user.id) },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Destino não encontrado" });
    }
    res.status(200).json({ message: "Destino eliminado com sucesso" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
