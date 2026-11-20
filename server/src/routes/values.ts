import express from "express";
import { ObjectId } from "mongodb";
import DynamicValueModel from "../models/DynamicValue.ts";
import requireAuth from "../middleware/requireAuth.ts";

const router: express.Router = express.Router();

router.get("/calculator", async (_req, res) => {
  const requiredTypes = ["ut_muni", "ut_capm"] as const;

  try {
    const records = await DynamicValueModel.find(
      { value_type: { $in: requiredTypes } },
      { projection: { value_type: 1, value: 1 } },
    ).toArray();
    const values = new Map(records.map(({ value_type, value }) => [value_type, value]));
    const utMuni = values.get("ut_muni");
    const utCapm = values.get("ut_capm");

    if (
      records.length !== requiredTypes.length ||
      typeof utMuni !== "number" ||
      !Number.isFinite(utMuni) ||
      utMuni <= 0 ||
      typeof utCapm !== "number" ||
      !Number.isFinite(utCapm) ||
      utCapm <= 0
    ) {
      return res.status(503).json({
        message: "Faltan valores de UT válidos en la base de datos",
      });
    }

    return res.status(200).json({ ut_muni: utMuni, ut_capm: utCapm });
  } catch (error) {
    console.error("Error al obtener los valores de la calculadora:", error);
    return res.status(500).json({ message: "No se pudieron cargar los valores" });
  }
});

router.use(requireAuth);

router.get("/", async (_req, res) => {
  try {
    const values = await DynamicValueModel.find({}).toArray();
    return res.status(200).json(
      values.map(({ _id, value_type, value, last_update }) => ({
        _id: _id.toString(),
        value_type,
        value,
        last_update,
      })),
    );
  } catch (error) {
    console.error("Error al obtener los valores dinámicos:", error);
    return res.status(500).json({ message: "No se pudieron cargar los valores" });
  }
});

router.put("/", async (req, res) => {
  const updates: unknown = req.body?.values;

  if (!Array.isArray(updates)) {
    return res.status(400).json({ message: "El campo values debe ser una lista" });
  }

  const parsedUpdates: Array<{ _id: ObjectId; value: number }> = [];
  const seenIds = new Set<string>();

  for (const update of updates) {
    if (
      typeof update !== "object" ||
      update === null ||
      typeof update._id !== "string" ||
      !ObjectId.isValid(update._id) ||
      typeof update.value !== "number" ||
      !Number.isFinite(update.value) ||
      update.value < 0 ||
      seenIds.has(update._id)
    ) {
      return res.status(400).json({ message: "Hay valores inválidos para guardar" });
    }

    seenIds.add(update._id);
    parsedUpdates.push({ _id: new ObjectId(update._id), value: update.value });
  }

  try {
    if (parsedUpdates.length > 0) {
      const ids = parsedUpdates.map(({ _id }) => _id);
      const existingCount = await DynamicValueModel.countDocuments({
        _id: { $in: ids },
      });

      if (existingCount !== parsedUpdates.length) {
        return res.status(404).json({ message: "Uno o más valores ya no existen" });
      }

      await DynamicValueModel.bulkWrite(
        parsedUpdates.map(({ _id, value }) => ({
          updateOne: {
            filter: { _id },
            update: { $set: { value, last_update: new Date() } },
          },
        })),
      );
    }

    const values = await DynamicValueModel.find({}).toArray();
    return res.status(200).json(
      values.map(({ _id, value_type, value, last_update }) => ({
        _id: _id.toString(),
        value_type,
        value,
        last_update,
      })),
    );
  } catch (error) {
    console.error("Error al guardar los valores dinámicos:", error);
    return res.status(500).json({ message: "No se pudieron guardar los valores" });
  }
});

export default router;
