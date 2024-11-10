// controllers/userController.ts
import { Request, Response } from "express";
import User from "../models/user";

export const updateUserInfo = async (req: Request, res: Response) => {
  const { userId, department, regulation, interests, rollno } = req.body;
  const clerkId = userId;

  console.log("Received data:", { userId, department, regulation, interests, rollno });

  try {
    // Find the user by clerkId and update the fields
    const updatedUser = await User.findOneAndUpdate(
      { clerkId },
      {
        department,
        regulation,
        interests,
        rollno,
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User info updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating user info:", error);
    res.status(500).json({ message: "Error updating user info" });
  }
};
