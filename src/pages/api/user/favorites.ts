import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { UserModel } from "@/db/models/userModel";
import { authOptions } from "../auth/[...nextauth]";
import { getServerSession } from "next-auth";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  const session = await getServerSession(req, res, authOptions);

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const response = await UserModel.findOne({ email: session.user.email })
        .select("favorites")
        .sort({ createdAt: -1 })
        .lean();

      if (response && !response.favorites) {
        return res.status(200).json({ favorites: [] });
      }
      return res.status(200).json(response!.favorites);
    } else if (req.method === "POST") {
      const _id = req.body;

      if (!_id) {
        return res.status(400).json({ error: "_id are required" });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { email: session.user.email },
        { $addToSet: { favorites: _id } },
        { new: true }
      ).select("favorites");

      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      return res.status(200).json(_id);
    } else if (req.method === "DELETE") {
      const _id = req.body;

      if (!_id) {
        return res.status(400).json({ error: "_id are required" });
      }

      const updatedUser = await UserModel.findOneAndUpdate(
        { email: session.user.email },
        { $pull: { favorites: _id } },
        { new: true }
      ).select("favorites");

      if (!updatedUser) {
        return res.status(404).json({
          error: "favorite not found or photo not found in user's photo array",
        });
      }

      return res.status(200).json(updatedUser.favorites);
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
