import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { DeletedUserPhotoModel } from "@/db/models";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";
import { PropertyModel } from "@/db/models/PropertyModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as CustomSession;

  await dbConnect();

  const { userId } = req.query;

  let queryId;
  if (mongoose.Types.ObjectId.isValid(userId as string)) {
    queryId = new mongoose.Types.ObjectId(userId as string);
  } else {
    queryId = userId as string;
  }

  if (!userId) {
    return res.status(400).json({ error: "userId is required" });
  }

  try {
    if (req.method === "GET") {
      const { page } = req.query;
      const perPage = 10;
      const skip = page ? parseInt(page as string) * perPage : 0;
      const response = await PropertyModel.findOne({ _id: queryId })
        .select("photos")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(perPage)
        .lean();

      if (response && !response.photos) {
        return res.status(200).json({ photos: [] });
      }
      return res.status(200).json(response!.photos);
    } else if (req.method === "POST") {
      const { photos } = req.body;

      if (!session || !session.user || session.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorize" });
      }

      if (!photos || !Array.isArray(photos)) {
        return res
          .status(400)
          .json({ error: "Photos are required and must be an array" });
      }

      const updatedUser = await PropertyModel.findOneAndUpdate(
        { _id: queryId },
        { $push: { photos: { $each: photos } } },
        { new: true }
      ).select("photos");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(photos);
    } else if (req.method === "DELETE") {
      const { photo } = req.body;

      if (!session || !session.user || session.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorize" });
      }

      if (!photo) {
        return res.status(400).json({ error: "Photo URL is required" });
      }

      const deletedUserPhoto = new DeletedUserPhotoModel({
        user: queryId,
        url: photo,
      });

      await deletedUserPhoto.save();

      const updatedUser = await PropertyModel.findOneAndUpdate(
        { _id: queryId },
        { $pull: { photos: photo } },
        { new: true }
      ).select("photos");

      if (!updatedUser) {
        return res.status(404).json({
          error: "User not found or photo not found in user's photo array",
        });
      }

      return res.status(200).json(updatedUser.photos);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
