import { User } from '../models/user.model.js';

export const register = async (req, res) => {
  try {
    const { username, email } = req.body;

    const userExists = await User.findOne({
      $or: [
        { username: username.toLowerCase() },
        { email: email.toLowerCase() }
      ]
    });

    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const user = await User.create({
      ...req.body,
      username: username.toLowerCase(),
      email: email.toLowerCase()
    });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query || query.trim().length < 2) {
      res.status(400);
      throw new Error('Search query must be at least 2 characters long');
    }

    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    })
    .select('-password')
    .limit(10);

    res.json({
      results: users,
      count: users.length
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};