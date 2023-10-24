import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]";
import { PropertyModel } from "@/db/models/PropertyModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { title, email, tlf, details, user, tags } = req.body;

  const session = (await getServerSession(
    req,
    res,
    authOptions
  )) as CustomSession;

  if (
    !session ||
    !session.user ||
    session.user.email !== user ||
    session.role !== "ADMIN"
  ) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  if (!title || !user) {
    return res.status(400).json({ error: "Required fields incompleted" });
  }

  await dbConnect();

  function generateSlug(title: string, num = 0) {
    let slug = title.trim().toLowerCase().replace(/ /g, "-");
    if (num) {
      slug = `${slug}-${num}`;
    }
    return slug;
  }

  try {
    const existingProperty = await PropertyModel.findOne({
      user: session.user.email,
      title,
    });
    if (existingProperty) {
      return res
        .status(409)
        .json({ error: "Property with the same title already exists" });
    }

    let slug = generateSlug(title);
    let counter = 0;

    // Loop until we find a unique slug or hit a reasonable limit (e.g., 1000)
    while ((await PropertyModel.findOne({ slug })) && counter < 1000) {
      counter += 1;
      slug = generateSlug(title, counter);
    }

    if (counter === 1000) {
      return res
        .status(500)
        .json({ error: "Unable to generate a unique slug" });
    }

    const property = new PropertyModel({
      title,
      email,
      slug,
      tlf,
      details,
      user,
      tags,
    });
    await property.save();

    return res.status(201).json({ message: "Property posted." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Error: ${error}` });
  }
}
