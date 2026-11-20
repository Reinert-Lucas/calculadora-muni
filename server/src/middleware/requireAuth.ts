import "dotenv/config";
import type { RequestHandler } from "express";
import { ObjectId } from "mongodb";
import { errors, jwtVerify } from "jose";

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET debe estar definida en el entorno del servidor");
}

const secret = new TextEncoder().encode(jwtSecret);

const requireAuth: RequestHandler = async (req, res, next) => {
  const token: unknown = req.cookies?.auth_token;

  if (typeof token !== "string") {
    res.status(401).json({ message: "No autenticado" });
    return;
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || !ObjectId.isValid(payload.sub)) {
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    next();
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      res.status(401).json({ message: "No autenticado" });
      return;
    }

    next(error);
  }
};

export default requireAuth;
