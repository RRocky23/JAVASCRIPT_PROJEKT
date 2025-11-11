import bcrypt from "bcrypt";
import User from "../models/User.js";

export const registerUser = async (userData) => {
    const { username, name, surname, birthDate, email, password } = userData;

    const errors = {};

    const latinNameRegex = /^[\p{Script=Latin}\s'-]+$/u;

    if(!username) {
        errors.username = "Username is required.";
    } 
    else if(username.length < 2 || username.length > 20) {
        errors.username = "Username must be between 2 and 20 characters.";
    }

    if(!name) {
        errors.name = "Name is required.";
    } 
    else if (!latinNameRegex.test(name)) {
        errors.name = "Name can only contain letters, spaces, apostrophes, and hyphens.";
    }

    if(!surname) {
        errors.surname = "Surname is required.";
    } 
    else if (!latinNameRegex.test(surname)) {
        errors.surname = "Surname can only contain letters, spaces, apostrophes, and hyphens.";
    }

    if(!birthDate) {
        errors.birthDate = "Birth date is required.";
    } 
    else {
        const birth = new Date(birthDate);
        const now = new Date();
        
        if(birth > now) {
            errors.birthDate = "Birth date cannot be in the future.";
        }
    }

    if(!email) {
        errors.email = "Email is required.";
    } 
    else if(!/^[\w.-]+@[A-Za-z\d.-]+\.[A-Za-z]{2,}$/.test(email)) {
        errors.email = "Invalid email address format.";
    }

    if(!password) {
        errors.password = "Password is required.";
    } 
    else if(password.length < 8 || password.length > 30) {
        errors.password = "Password must be between 8 and 30 characters.";
    } 
    else if (!/(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}/.test(password)) {
        errors.password = "Password must contain at least one uppercase letter, one number, and one special character.";
    }

    if(Object.keys(errors).length > 0) {
        return { success: false, status: 400, errors };
    }

    const usedUsername = await User.findOne({ username });
    if(usedUsername) { 
        errors.username = "Username already used.";
    }

    const usedEmail = await User.findOne({ email });
    if(usedEmail) {
         errors.email = "Email already used.";
    }

    if(Object.keys(errors).length > 0) {
        return { success: false, status: 409, errors };
    }
    
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, name, surname, birthDate, email, passwordHash });

    await newUser.save();

    return { success: true, status: 201, message: 'User registered successfully' };
}