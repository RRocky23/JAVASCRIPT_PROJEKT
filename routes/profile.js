import express from "express";

const router = express.Router();

router.get("/list", (req, res) => {
    res.send("List GET page");
});

router.get("/details", (req, res) => {
    res.send("Details GET page");
});

export default router;