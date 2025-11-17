import express from "express";

const router = express.Router();

router.get('/home', (req, res) => {
    res.send('This is home page');
});

router.get('/error', (req, res) => {
    res.send('This is error page');
});

export default router;