import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [
        { username: username.toLowerCase() },
        { email: username.toLowerCase() }
      ]
    });

    if (!user || !(await user.comparePassword(password))) {
      res.status(401);
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });
  } catch (error) {
    res.status(res.statusCode === 200 ? 500 : res.statusCode);
    throw error;
  }
};