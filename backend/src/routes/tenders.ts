import { Router } from "express";
const router = Router();

// GET /api/tenders
router.get("/", (_req, res) => {
  res.json({
    items: [
      { id: "TDR-001", title: "Procurement A", status: "open" },
      { id: "TDR-002", title: "Procurement B", status: "closed" }
    ]
  });
});

export default router;
