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
}