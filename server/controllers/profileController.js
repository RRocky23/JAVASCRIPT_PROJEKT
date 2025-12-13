import Pokemon from '../models/Pokemon.js';
import User from '../models/User.js'

export const getUsers = async () => {
  try {
    const pokemons = await Pokemon.find();
    return pokemons
  } 
  catch(err) {
    console.error('Error fetching pokemons:', err);
    throw err;
  }
};

export const getCurrentUser = async (userId) => {
  try {
    const user = await User.findById(userId).select('-passwordHash -refreshToken');
    
    if (!user) {
      throw new Error('User not found');
    }
    
    return user;
  } 
  catch(err) {
    console.error('Error fetching current user:', err);
    throw err;
  }
};