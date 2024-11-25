import Room from "../models/room"; // Assuming you have a Room model
import { Post } from "../models/post";

import { Request, Response } from "express";

export const createPost = async (req: Request, res: Response) => {
  const { roomName, userId, imageUrl, caption } = req.body;
  console.log("Creating post:", req.body);
  try {
    // Check if the room exists
    const room = await Room.findOne({ roomName: roomName });
    if (!room) {
      return res
        .status(404)
        .json({ message: "Room not found. Please create it first." });
    }

    // Create the post
    const post = new Post({
      roomId: room._id,
      userId,
      imageUrl,
      caption,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully!", post });
  } catch (error) {
    console.error("Error creating post:", error);
    res
      .status(500)
      .json({ message: "An error occurred while creating the post." });
  }
};

export const getPosts = async (req: Request, res: Response) => {
  try {
    // Fetch posts with associated room details
    const posts = await Post.find().populate("roomId", "roomName _id");

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching posts." });
  }
};
