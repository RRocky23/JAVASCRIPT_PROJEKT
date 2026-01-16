import express from "express";
import { authenticateToken } from "../middlewares/auth.js";
import {
    searchUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend,
    getFriends,
    getFriendRequests,
    getFriendPokemon,
    sendTradeRequest,
    getTradeRequests,
    acceptTrade,
    rejectTrade
} from "../controllers/friendsController.js";

const router = express.Router();

// Search users
router.get("/search", authenticateToken, searchUsers);

// Friend requests
router.post("/request", authenticateToken, sendFriendRequest);
router.post("/request/:id/accept", authenticateToken, acceptFriendRequest);
router.post("/request/:id/reject", authenticateToken, rejectFriendRequest);
router.get("/requests", authenticateToken, getFriendRequests);

// Friends
router.get("/", authenticateToken, getFriends);
router.delete("/:id", authenticateToken, removeFriend);

// Friend's Pokemon
router.get("/:id/pokemon", authenticateToken, getFriendPokemon);

// Trade requests
router.post("/trade/request", authenticateToken, sendTradeRequest);
router.get("/trade/requests", authenticateToken, getTradeRequests);
router.post("/trade/:id/accept", authenticateToken, acceptTrade);
router.post("/trade/:id/reject", authenticateToken, rejectTrade);

export default router;
