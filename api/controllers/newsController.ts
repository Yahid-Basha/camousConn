import express, { Request, Response } from "express";
import CampusNews from "../models/campusNews";

export const postNews = async (req: Request, res: Response) => {
  try {
    const { userId, text, link, startDate, endDate } = req.body;

    if (!userId || !text || !startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided." });
    }

    // Create a new news item
    const news = new CampusNews({
      userId,
      text,
      link,
      startDate,
      endDate,
    });

    // Save to database
    const savedNews = await news.save();
    res
      .status(201)
      .json({ message: "News posted successfully", news: savedNews });
  } catch (error) {
    console.error("Error posting news:", error);
    res.status(500).json({ error: "Failed to post news." });
  }
};

export const fetchActiveNews = async (req: Request, res: Response) => {
  try {
    const currentDate = new Date();

    // Query to find news items where the current date is between startDate and endDate
    const activeNews = await CampusNews.find({
      startDate: { $lte: currentDate },
      endDate: { $gte: currentDate },
    }).sort({ timestamp: -1 }); // Sorting by latest posted news first

    res.status(200).json({ news: activeNews });
  } catch (error) {
    console.error("Error fetching active news:", error);
    res.status(500).json({ error: "Failed to fetch news." });
  }
};
