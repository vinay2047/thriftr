import { Router } from "express";
const router=Router();

router.get("/:rollno/healthz", (req, res) => {
  res.json({ status: "ok" });
});

router.get("/logs/recent", (req, res) => {
  res.json(requestLogs);
});

router.get("/logs/check", (req, res) => {
  res.json({
    message: "Logs check successful",
    storedLogs: requestLogs.length,
    lastLog: requestLogs[requestLogs.length - 1] || null,
  });
});

export default router;
