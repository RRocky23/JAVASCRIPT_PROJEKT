import express from "express";

const router = express.Router();

router.get("/register", (req, res) =>  {
    res.send("Register GET page");
});

router.post("/register", (req, res) => {
    res.send("Register POST page");
});

router.get("/login", (req, res) => {
    res.send("Login GET page");
});

router.post("/login", (req, res) => {
    res.send("Login POST page");
});

router.get("/edit", (req, res) => {
    res.send("Edit GET page");
});

router.post("/edit", (req, res) => {
    res.send("Edit POST page");
});

router.get("/details", (req, res) => {
    res.send("Details GET page");
});

export default router;