import { Request, Response } from 'express';
import User from '../models/user';

// Fetch user data by user ID
export const getUserData = async (req: Request, res: Response) => {
  const clerkId = req.query.userId; // Assuming you're fetching by user ID
  console.log("Clerk iddddddddd--------------------:",clerkId);

  try {
    const user = await User.findOne({ clerkId: clerkId })

    console.log("User-----------------" ,user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};
