const express = require("express");
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

async function ownsDestination(destinationId, userId) {
  const id = Number(destinationId);
  if (!Number.isFinite(id)) return false;
  const r = await prisma.destination.findFirst({
    where: { id, userId: Number(userId) },
    select: { id: true },
  });
  return !!r;
}

router.get("/destination/:destinationId", async (req, res, next) => {
  try {
    if (!(await ownsDestination(req.params.destinationId, req.user.id))) {
      return res.status(404).json({ message: "Destino não encontrado" });
    }
    const destinationId = Number(req.params.destinationId);
    const data = await prisma.experience.findMany({
      where: { destinationId },
      orderBy: { id: "asc" },
    });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

router.post("/destination/:destinationId", async (req, res, next) => {
  try {
    const { title, type, description, rating } = req.body;
    if (!title || !type) {
      return res.status(400).json({ message: "Título e tipo são obrigatórios" });
    }
    if (!["atividade", "restaurante", "outro"].includes(type)) {
      return res.status(400).json({ message: "Tipo inválido" });
    }
    if (!(await ownsDestination(req.params.destinationId, req.user.id))) {
      return res.status(404).json({ message: "Destino não encontrado" });
    }

    const destinationId = Number(req.params.destinationId);
    const created = await prisma.experience.create({
      data: {
        destinationId,
        title,
        type,
        description: description || null,
        rating: rating ?? null,
      },
    });
    res.status(201).json({ data: created });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { title, type, description, rating } = req.body;
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const owned = await prisma.experience.findFirst({
      where: { id, destination: { userId: Number(req.user.id) } },
      select: { id: true },
    });
    if (!owned) {
      return res.status(404).json({ message: "Experiência não encontrada" });
    }

    const updated = await prisma.experience.update({
      where: { id },
      data: {
        title: title ?? undefined,
        type: type ?? undefined,
        description: description ?? undefined,
        rating: rating ?? undefined,
      },
    });

    res.status(200).json({ data: updated });
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

    const deleted = await prisma.experience.deleteMany({
      where: { id, destination: { userId: Number(req.user.id) } },
    });

    if (deleted.count === 0) {
      return res.status(404).json({ message: "Experiência não encontrada" });
    }
    res.status(200).json({ message: "Experiência eliminada com sucesso" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
