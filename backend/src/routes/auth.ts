import { Router } from "express";
const router = Router();

// GET /api/auth
router.get("/", (_req, res) => {
  res.json({ message: "Auth route works!" });
});

// POST /api/auth/login (dummy)
router.post("/login", (req, res) => {
  const { username } = req.body || {};
  if (!username) return res.status(400).json({ error: "username is required" });
  res.json({ token: "dummy.jwt.token", user: { username } });
});

export default router;
