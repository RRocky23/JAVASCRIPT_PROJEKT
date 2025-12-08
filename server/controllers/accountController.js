import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const signAccessToken = (payload, expiresIn) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
const signRefreshToken = (payload, expiresIn) => jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn });

export const registerController = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const errors = {};

        if(!username) {
            errors.username = 'Username is required.';
        }
        else if(username.length < 2 || username.length > 20) {
            errors.username = 'Username must be between 2 and 20 characters.';
        }
        else if(!/^[a-zA-Z0-9_]+$/.test(username)) {
            errors.username = 'Username can only contain letters, numbers, and underscores.';
        }

        if(!email) {
            errors.email = 'Email is required.';
        }
        else if(!/^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/.test(email)) {
            errors.email = 'Invalid email address format.';
        }

        if(!password) {
            errors.password = 'Password is required.';
        }
        else if(password.length < 8 || password.length > 30) {
            errors.password = 'Password must be between 8 and 30 characters.';
        }
        else if(!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(password)) {
            errors.password = 'Password must contain at least one uppercase letter, one number, and one special character.';
        }

        if(Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const usedUsername = await User.findOne({ username });
        if(usedUsername) {
            errors.username = 'Username already used.';
        }

        const usedEmail = await User.findOne({ email });
        if(usedEmail) {
            errors.email = 'Email already used.';
        }

        if(Object.keys(errors).length > 0) {
            return res.status(409).json({ errors });
        }

        const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const newUser = new User({
            username,
            email,
            passwordHash,
        });

        await newUser.save();

        return res.status(201).json({ message: 'User registered successfully' });
    } 
    catch(err) {
        console.error('Register error', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const checkUsernameController = async (req, res) => {
    try {
        const { username } = req.query;

        if(!username) {
            return res.status(400).json({ message: 'Username is required' });
        }

        if(username.length < 2 || username.length > 20) {
            return res.status(400).json({ message: 'Username must be between 2 and 20 characters' });
        }

        if(!/^[a-zA-Z0-9_]+$/.test(username)) {
            return res.status(400).json({ message: 'Username can only contain letters, numbers, and underscores' });
        }

        const existingUser = await User.findOne({ username });

        if(existingUser) {
            return res.status(409).json({ available: false, message: 'Username already taken' });
        }

        return res.status(200).json({ available: true, message: 'Username available' });
    }
    catch(err) {
        console.error('Check username error', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const checkEmailController = async (req, res) => {
    try {
        const { email } = req.query;

        if(!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        if(!/^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        const existingUser = await User.findOne({ email });

        if(existingUser) {
            return res.status(409).json({ available: false, message: 'Email already in use' });
        }

        return res.status(200).json({ available: true, message: 'Email available' });
    }
    catch(err) {
        console.error('Check email error', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const loginController = async (req, res) => {
    try {
        let { userIdentifier, password, rememberMe } = req.body;
        rememberMe = !!rememberMe;

        const errors = {};
        
        if(!userIdentifier) {
            errors.userIdentifier = 'User identifier is required.';
        }

        if(!password) {
            errors.password = 'Password is required.';
        }

        if(Object.keys(errors).length > 0) {
            return res.status(400).json({ errors });
        }

        const user = await User.findOne({ username: userIdentifier }) || await User.findOne({ email: userIdentifier });
        if(!user) {
            return res.status(400).json({ errors: { password: 'Invalid user identifier or password.' } });
        }

        const passwordCheck = await bcrypt.compare(password, user.passwordHash);
        if(!passwordCheck) {
            return res.status(400).json({ errors: { password: 'Invalid user identifier or password.' } });
        }

        const payload = {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role
        };

        const accessExpires = process.env.JWT_EXPIRES || "30m";
        const accessExpiresRemember = process.env.JWT_EXPIRES_REMEMBER || "7d";
        const refreshExpires = process.env.REFRESH_EXPIRES || "3d";
        const refreshExpiresRemember = process.env.REFRESH_EXPIRES_REMEMBER || "14d";

        const accessToken = signAccessToken(payload, rememberMe ? accessExpiresRemember : accessExpires);
        const refreshToken = signRefreshToken(payload, rememberMe ? refreshExpiresRemember : refreshExpires);

        user.refreshToken = refreshToken;
        await user.save();

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: rememberMe ? (14 * 24 * 60 * 60 * 1000) : (3 * 24 * 60 * 60 * 1000)
        });

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: rememberMe ? (7 * 24 * 60 * 60 * 1000) : (30 * 60 * 1000)
        });

        return res.json({ accessToken });
    } 
    catch(err) {
        console.error('Login error', err);
        return res.status(500).json({ message: 'Server error' });
    }
};

export const refreshController = async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;
        if(!incomingToken) {
            return res.status(401).json({ message: 'Missing refresh token' });
        }

        let decoded;

        try {
            decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
        } 
        catch(err) {
            return res.status(403).json({ message: 'Invalid or expired refresh token' });
        }

        const user = await User.findById(decoded.id);
        if(!user || user.refreshToken !== incomingToken) {
            return res.status(403).json({ message: 'Refresh token not valid' });
        }

        const payload = { 
            id: user._id, 
            email: user.email, 
            username: user.username, 
            role: user.role 
        };

        const accessExpires = process.env.JWT_EXPIRES || "30m";
        const refreshExpires = process.env.REFRESH_EXPIRES || "3d";

        const newAccessToken = signAccessToken(payload, accessExpires);
        const newRefreshToken = signRefreshToken(payload, refreshExpires);

        user.refreshToken = newRefreshToken;
        await user.save();

        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 3 * 24 * 60 * 60 * 1000
        });

        res.cookie('accessToken', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 30 * 60 * 1000
        });

        return res.json({ accessToken: newAccessToken });
    } 
    catch(err) {
        console.error('Refresh error', err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const logoutController = async (req, res) => {
    try {
        const incomingToken = req.cookies?.refreshToken;
        if(incomingToken) {
            try {
                const decoded = jwt.verify(incomingToken, process.env.JWT_REFRESH_SECRET);
                const user = await User.findById(decoded.id);
        
                if(user) {
                    user.refreshToken = null;
                    await user.save();
                }
            } 
            catch(err) {
                console.error('Token verification during logout failed:', err.message);
            }
        }

        res.clearCookie('refreshToken', { path: '/' });
        res.clearCookie('accessToken', { path: '/' });
        
        return res.json({ message: 'Logged out' });
    } 
    catch(err) {
        console.error('Logout error', err);
        return res.status(500).json({ message: 'Server error' });
    }
};