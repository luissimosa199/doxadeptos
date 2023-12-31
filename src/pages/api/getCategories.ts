import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../db/dbConnect";
import { PropertyModel } from "@/db/models/PropertyModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "GET") {
    try {
      const tags = await PropertyModel.distinct("tags");

      res.status(200).json(tags);
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
