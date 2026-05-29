const express = require("express");
const fs = require("fs");
const path = require("path");
const prisma = require("../db/prisma");
const auth = require("../middleware/auth");
const { upload } = require("../middleware/upload");

const router = express.Router();
router.use(auth);

const MAX_PHOTOS = 4;

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
    const data = await prisma.photo.findMany({
      where: { destinationId },
      orderBy: { id: "asc" },
    });
    res.status(200).json({ data });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/destination/:destinationId",
  upload.array("photos", MAX_PHOTOS),
  async (req, res, next) => {
    try {
      const destId = req.params.destinationId;
      if (!(await ownsDestination(destId, req.user.id))) {
        return res.status(404).json({ message: "Destino não encontrado" });
      }

      const destinationId = Number(destId);
      const current = await prisma.photo.count({ where: { destinationId } });
      const files = req.files || [];

      if (files.length === 0) {
        return res.status(400).json({ message: "Nenhuma foto enviada" });
      }
      if (current + files.length > MAX_PHOTOS) {
        files.forEach((f) => fs.unlinkSync(path.join(process.env.UPLOAD_DIR || "uploads", f.filename)));
        return res.status(400).json({
          message: `Máximo de ${MAX_PHOTOS} fotos por destino (atual: ${current})`,
        });
      }

      const inserted = [];
      for (const file of files) {
        const created = await prisma.photo.create({
          data: {
            destinationId,
            filename: file.filename,
            originalName: file.originalname,
          },
        });
        inserted.push(created);
      }
      res.status(201).json({ data: inserted });
    } catch (err) {
      next(err);
    }
  }
);

router.delete("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) {
      return res.status(400).json({ message: "ID inválido" });
    }

    const photo = await prisma.photo.findFirst({
      where: { id, destination: { userId: Number(req.user.id) } },
    });
    if (!photo) {
      return res.status(404).json({ message: "Foto não encontrada" });
    }

    const filePath = path.join(process.env.UPLOAD_DIR || "uploads", photo.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await prisma.photo.delete({ where: { id: photo.id } });
    res.status(200).json({ message: "Foto eliminada com sucesso" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
