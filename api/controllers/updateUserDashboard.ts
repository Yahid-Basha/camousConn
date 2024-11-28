import { Request, Response } from "express";
import User from "../models/user";

export const updateUserDashboard = async (req: Request, res: Response) => {
  const { userId, category, data } = req.body;
  console.log("called updateUserDashboard");
  console.log("Received user data:", req.body);
  try {
    const user = await User.findOne({ clerkId: userId });
    console.log("User found:", user?.name);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (category) {
      case "attendance":
      case "gpa":
        // Overwrite primitive fields
        (user as any)[category] = parseFloat(data[category]);
        break;

      case "grades":
        // Overwrite Map fields
        Object.entries(data).forEach(([key, value]) => {
          if (!user.grades) {
            user.grades = new Map<string, string>();
          }
          user.grades.set(key, value as string);
        });
        break;

      case "upcomingAssignments":
        // Append a new assignment to the array
        if (Array.isArray(user.upcomingAssignments)) {
          user.upcomingAssignments.push(data);
        } else {
          console.log(
            "error appending assignment because user.upcomingAssignments is not an array"
          );
        }
        break;

      case "upcomingExams":
        // Append a new exam to the array
        if (Array.isArray(user.upcomingExams)) {
          user.upcomingExams.push(data);
        } else {
          console.log(
            "error appending assignment because user.upcomingExams is not an array"
          );
        }
        break;

      case "achievements":
        // Append a new achievement to the array
        if (Array.isArray(user.achievements)) {
          user.achievements.push(data);
        } else {
          console.log(
            "error appending assignment because user.user.achievents is not an array"
          );
        }
        break;

      case "certificates":
        // Append a new certificate to the array
        if (Array.isArray(user.certificates)) {
          user.certificates.push(data);
        } else {
          console.log(
            "error appending assignment because user.certificates is not an array"
          );
        }
        break;

      case "extracurricularActivities":
        // Append a new activity to the array
        if (Array.isArray(user.extracurricularActivities)) {
          user.extracurricularActivities.push(data.activity);
        } else {
          user.extracurricularActivities = [data.activity];
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid category" });
    }

    await user.save();

    res.status(200).json({
      message: "User details updated successfully",
      user,
    });
  } catch (error) {
    console.error("Error updating user details:", error);
    res.status(500).json({ message: "Error updating user details" });
  }
};
