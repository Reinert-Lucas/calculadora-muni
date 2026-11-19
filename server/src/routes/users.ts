import "dotenv/config";
import cookieParser from "cookie-parser";
import express from "express";
import { ObjectId } from "mongodb";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcrypt";
import UserModel from "../models/User.ts";

const router: express.Router = express.Router();
const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET debe estar definida en el entorno del servidor");
}

const secret = new TextEncoder().encode(jwtSecret);
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 1000,
};

router.use(cookieParser());

router.post("/login", async (req, res) => {
  const { username, password } = req.body ?? {};

  if (
    typeof username !== "string" ||
    typeof password !== "string" ||
    !username.trim() ||
    !password
  ) {
    return res.status(400).json({ message: "Usuario y contraseña son requeridos" });
  }

  try {
    const user = await UserModel.findOne({ username: username.trim() });
    const validPassword =
      user && typeof user.password === "string"
        ? await bcrypt.compare(password, user.password)
        : false;

    if (!user || !validPassword) {
      return res.status(401).json({ message: "Credenciales incorrectas" });
    }

    const token = await new SignJWT({ username: user.username })
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(user._id.toString())
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(secret);

    res.cookie("auth_token", token, cookieOptions);
    return res.status(200).json({ user: { username: user.username } });
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
    return res.status(500).json({ message: "No se pudo iniciar sesión" });
  }
});

router.get("/me", async (req, res) => {
  const token: unknown = req.cookies?.auth_token;

  if (typeof token !== "string") {
    return res.status(401).json({ message: "No autenticado" });
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (!payload.sub || !ObjectId.isValid(payload.sub)) {
      res.clearCookie("auth_token", cookieOptions);
      return res.status(401).json({ message: "No autenticado" });
    }

    const user = await UserModel.findOne(
      { _id: new ObjectId(payload.sub) },
      { projection: { username: 1 } },
    );

    if (!user) {
      res.clearCookie("auth_token", cookieOptions);
      return res.status(401).json({ message: "No autenticado" });
    }

    return res.status(200).json({ user: { username: user.username } });
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "JWTExpired" || error.name === "JWSSignatureVerificationFailed" ||
        error.name === "JWTInvalid")
    ) {
      res.clearCookie("auth_token", cookieOptions);
      return res.status(401).json({ message: "No autenticado" });
    }

    console.error("Error al verificar la sesión:", error);
    return res.status(500).json({ message: "No se pudo verificar la sesión" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("auth_token", cookieOptions);
  return res.status(204).end();
});

export default router;
