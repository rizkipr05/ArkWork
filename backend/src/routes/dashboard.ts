import { Router } from "express";
const router = Router();

// GET /api/dashboard
router.get("/", (_req, res) => {
  res.json({
    widgets: [
      { id: 1, name: "Users", value: 120 },
      { id: 2, name: "Revenue", value: 540000 }
    ]
  });
});

export default router;
