import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET!;
export type JWTPayload = { uid: string };
export const signToken = (p: JWTPayload) => jwt.sign(p, SECRET, { expiresIn: "7d" });
export const verifyToken = (t: string) => jwt.verify(t, SECRET) as JWTPayload;
