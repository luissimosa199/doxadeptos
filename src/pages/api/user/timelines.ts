import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { TimeLineModel } from "@/db/models/timelineModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    await dbConnect();

    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { page } = req.query;

    const perPage = 10;
    const skip = page ? parseInt(page as string) * perPage : 0;

    const response = await TimeLineModel.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(perPage)
      .lean();

    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching timelines:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
