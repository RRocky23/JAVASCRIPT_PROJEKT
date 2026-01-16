import User from "../models/User.js";
import UserPokemon from "../models/UserPokemon.js";
import TradeRequest from "../models/TradeRequest.js";
import mongoose from "mongoose";

// Search users by username
export const searchUsers = async (req, res) => {
    try {
        const { q } = req.query;
        const currentUserId = req.user.id;

        if (!q || q.trim().length === 0) {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const users = await User.find({
            username: { $regex: q, $options: 'i' },
            _id: { $ne: currentUserId }
        })
        .select('username level')
        .limit(10);

        res.json(users);
    } catch (error) {
        console.error('Search users error:', error);
        res.status(500).json({ error: 'Failed to search users' });
    }
};

// Send friend request
export const sendFriendRequest = async (req, res) => {
    try {
        const { userId } = req.body;
        const currentUserId = req.user.id;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        if (userId === currentUserId.toString()) {
            return res.status(400).json({ error: 'Cannot add yourself as a friend' });
        }

        const targetUser = await User.findById(userId);
        if (!targetUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        // Check if already friends
        if (currentUser.friends.includes(userId)) {
            return res.status(400).json({ error: 'Already friends with this user' });
        }

        // Check if request already sent
        if (targetUser.friendRequests.includes(currentUserId)) {
            return res.status(400).json({ error: 'Friend request already sent' });
        }

        // Check if target user already sent a request to current user
        if (currentUser.friendRequests.includes(userId)) {
            return res.status(400).json({ error: 'This user already sent you a friend request' });
        }

        targetUser.friendRequests.push(currentUserId);
        await targetUser.save();

        res.json({ message: 'Friend request sent successfully' });
    } catch (error) {
        console.error('Send friend request error:', error);
        res.status(500).json({ error: 'Failed to send friend request' });
    }
};

// Accept friend request
export const acceptFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const requestUser = await User.findById(id);
        if (!requestUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!currentUser.friendRequests.includes(id)) {
            return res.status(400).json({ error: 'No friend request from this user' });
        }

        // Remove from friend requests
        currentUser.friendRequests = currentUser.friendRequests.filter(
            reqId => reqId.toString() !== id
        );

        // Add to friends for both users
        currentUser.friends.push(id);
        requestUser.friends.push(currentUserId);

        await currentUser.save();
        await requestUser.save();

        res.json({ message: 'Friend request accepted' });
    } catch (error) {
        console.error('Accept friend request error:', error);
        res.status(500).json({ error: 'Failed to accept friend request' });
    }
};

// Reject friend request
export const rejectFriendRequest = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        if (!currentUser.friendRequests.includes(id)) {
            return res.status(400).json({ error: 'No friend request from this user' });
        }

        currentUser.friendRequests = currentUser.friendRequests.filter(
            reqId => reqId.toString() !== id
        );

        await currentUser.save();

        res.json({ message: 'Friend request rejected' });
    } catch (error) {
        console.error('Reject friend request error:', error);
        res.status(500).json({ error: 'Failed to reject friend request' });
    }
};

// Remove friend
export const removeFriend = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        const friendUser = await User.findById(id);
        if (!friendUser) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (!currentUser.friends.includes(id)) {
            return res.status(400).json({ error: 'Not friends with this user' });
        }

        // Remove from both users' friends lists
        currentUser.friends = currentUser.friends.filter(
            friendId => friendId.toString() !== id
        );
        friendUser.friends = friendUser.friends.filter(
            friendId => friendId.toString() !== currentUserId.toString()
        );

        await currentUser.save();
        await friendUser.save();

        res.json({ message: 'Friend removed' });
    } catch (error) {
        console.error('Remove friend error:', error);
        res.status(500).json({ error: 'Failed to remove friend' });
    }
};

// Get friends list
export const getFriends = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const user = await User.findById(currentUserId)
            .populate('friends', 'username level');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.friends);
    } catch (error) {
        console.error('Get friends error:', error);
        res.status(500).json({ error: 'Failed to get friends' });
    }
};

// Get friend requests
export const getFriendRequests = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const user = await User.findById(currentUserId)
            .populate('friendRequests', 'username level');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user.friendRequests);
    } catch (error) {
        console.error('Get friend requests error:', error);
        res.status(500).json({ error: 'Failed to get friend requests' });
    }
};

// Get friend's Pokémon
export const getFriendPokemon = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        if (!currentUser.friends.includes(id)) {
            return res.status(403).json({ error: 'Not friends with this user' });
        }

        const pokemon = await UserPokemon.find({ userId: id })
            .populate('pokemonId', 'name sprite type')
            .sort({ createdAt: -1 });

        res.json(pokemon);
    } catch (error) {
        console.error('Get friend pokemon error:', error);
        res.status(500).json({ error: 'Failed to get friend pokemon' });
    }
};

// Send trade request
export const sendTradeRequest = async (req, res) => {
    try {
        const { toUserId, fromPokemonId, toPokemonId } = req.body;
        const currentUserId = req.user.id;

        if (!toUserId || !fromPokemonId || !toPokemonId) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const currentUser = await User.findById(currentUserId);
        if (!currentUser) {
            return res.status(404).json({ error: 'Current user not found' });
        }

        if (!currentUser.friends.includes(toUserId)) {
            return res.status(403).json({ error: 'Not friends with this user' });
        }

        // Verify ownership of Pokémon
        const fromPokemon = await UserPokemon.findOne({
            _id: fromPokemonId,
            userId: currentUserId
        });
        const toPokemon = await UserPokemon.findOne({
            _id: toPokemonId,
            userId: toUserId
        });

        if (!fromPokemon) {
            return res.status(404).json({ error: 'Your Pokémon not found' });
        }
        if (!toPokemon) {
            return res.status(404).json({ error: 'Friend\'s Pokémon not found' });
        }

        const tradeRequest = new TradeRequest({
            fromUser: currentUserId,
            toUser: toUserId,
            fromPokemon: fromPokemonId,
            toPokemon: toPokemonId
        });

        await tradeRequest.save();

        res.json({ message: 'Trade request sent successfully', tradeRequest });
    } catch (error) {
        console.error('Send trade request error:', error);
        res.status(500).json({ error: 'Failed to send trade request' });
    }
};

// Get trade requests
export const getTradeRequests = async (req, res) => {
    try {
        const currentUserId = req.user.id;

        const tradeRequests = await TradeRequest.find({
            $or: [
                { fromUser: currentUserId },
                { toUser: currentUserId }
            ],
            status: 'pending'
        })
        .populate('fromUser', 'username')
        .populate('toUser', 'username')
        .populate({
            path: 'fromPokemon',
            populate: { path: 'pokemonId', select: 'name sprite type' }
        })
        .populate({
            path: 'toPokemon',
            populate: { path: 'pokemonId', select: 'name sprite type' }
        })
        .sort({ createdAt: -1 });

        res.json(tradeRequests);
    } catch (error) {
        console.error('Get trade requests error:', error);
        res.status(500).json({ error: 'Failed to get trade requests' });
    }
};

// Accept trade
export const acceptTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const tradeRequest = await TradeRequest.findById(id);

        if (!tradeRequest) {
            return res.status(404).json({ error: 'Trade request not found' });
        }

        if (tradeRequest.toUser.toString() !== currentUserId.toString()) {
            return res.status(403).json({ error: 'Not authorized to accept this trade' });
        }

        if (tradeRequest.status !== 'pending') {
            return res.status(400).json({ error: 'Trade request is not pending' });
        }

        // Swap Pokémon ownership
        const fromPokemon = await UserPokemon.findById(tradeRequest.fromPokemon);
        const toPokemon = await UserPokemon.findById(tradeRequest.toPokemon);

        if (!fromPokemon || !toPokemon) {
            return res.status(404).json({ error: 'One or both Pokémon not found' });
        }

        fromPokemon.userId = tradeRequest.toUser;
        toPokemon.userId = tradeRequest.fromUser;

        await fromPokemon.save();
        await toPokemon.save();

        tradeRequest.status = 'accepted';
        await tradeRequest.save();

        res.json({ message: 'Trade completed successfully' });
    } catch (error) {
        console.error('Accept trade error:', error);
        res.status(500).json({ error: 'Failed to accept trade' });
    }
};

// Reject trade
export const rejectTrade = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUserId = req.user.id;

        const tradeRequest = await TradeRequest.findById(id);

        if (!tradeRequest) {
            return res.status(404).json({ error: 'Trade request not found' });
        }

        if (tradeRequest.toUser.toString() !== currentUserId.toString()) {
            return res.status(403).json({ error: 'Not authorized to reject this trade' });
        }

        if (tradeRequest.status !== 'pending') {
            return res.status(400).json({ error: 'Trade request is not pending' });
        }

        tradeRequest.status = 'rejected';
        await tradeRequest.save();

        res.json({ message: 'Trade rejected' });
    } catch (error) {
        console.error('Reject trade error:', error);
        res.status(500).json({ error: 'Failed to reject trade' });
    }
};
