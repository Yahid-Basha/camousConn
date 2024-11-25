import Room from "../models/room";
import { Request, Response } from "express";
// Get all rooms
export const getAllRooms = async (req: Request, res: Response) => {
  try {
    const rooms = await Room.find({}, "roomName _id"); // Fetch only room name and ID
    res.status(200).json(rooms);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).json({ message: "Failed to fetch rooms." });
  }
};
