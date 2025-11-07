import User from '../models/User.js'

export const getUsers = async () => {
    try {
        const users = await User.find();
        return users
  } 
  catch(err) {
    console.error('Error fetching users:', err);
    throw err;
  }
}