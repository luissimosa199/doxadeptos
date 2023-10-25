import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { getServerSession } from "next-auth";
import { CustomSession, authOptions } from "../auth/[...nextauth]";
import mongoose from "mongoose";
import { PropertyModel } from "@/db/models/PropertyModel";
import { DeletedPropertyModel } from "@/db/models/deletedPropertyModel";

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
  const { id } = req.query;

  let queryId;
  if (mongoose.Types.ObjectId.isValid(id as string)) {
    queryId = new mongoose.Types.ObjectId(id as string);
  } else {
    queryId = id as string;
  }

  try {
    if (req.method === "GET") {
      if (id) {
        const isSlug = id.length !== 9;
        let property;

        if (isSlug) {
          property = await PropertyModel.findOne({ slug: queryId });
        } else {
          property = await PropertyModel.findOne({ _id: queryId });
        }
        return res.status(200).json(property);
      }

      const properties = await PropertyModel.find()
        .select("email title image tags isArchived slug details")
        .sort({ createdAt: -1 });
      if (!properties) {
        return res.status(404).json({ error: "No propertys found" });
      }
      return res.status(200).json(properties);
    } else if (req.method === "POST") {
      // migrar register?
      console.log("POST");
    } else if (req.method === "DELETE") {
      if (!session || !session.user || session.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorize" });
      }

      const property = await PropertyModel.findOne({ _id: queryId });
      const propertyObject = property?.toObject();

      const saveDeletedProperty = new DeletedPropertyModel({
        ...propertyObject,
        deletedAt: new Date(),
      });

      await saveDeletedProperty.save();

      const deletedProperty = await PropertyModel.findOneAndRemove({
        _id: queryId,
      });

      if (deletedProperty) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: "property not found" });
      }
    } else if (req.method === "PUT") {
      if (!session || !session.user || session.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorize" });
      }
      try {
        const updateData = req.body;

        const updatedProperty = await PropertyModel.findOneAndUpdate(
          { _id: queryId },
          updateData,
          {
            new: true,
          }
        );

        if (updatedProperty) {
          res.status(200).json(updatedProperty);
        } else {
          res.status(404).json({ message: "Property not found" });
        }
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error });
      }
    } else if (req.method === "PATCH") {
      if (!session || !session.user || session.role !== "ADMIN") {
        return res.status(401).json({ error: "Unauthorize" });
      }
      try {
        const property = await PropertyModel.findById(queryId);

        if (!property) {
          return res.status(404).json({ message: "property not found" });
        }

        const newIsArchivedStatus = property.isArchived
          ? !property.isArchived
          : true;

        const updatedProperty = await PropertyModel.findOneAndUpdate(
          { _id: queryId },
          { isArchived: newIsArchivedStatus },
          {
            new: true,
          }
        );

        res.status(200).json(updatedProperty);
      } catch (error) {
        res
          .status(500)
          .json({ message: "Internal server error", error: error });
      }
    } else {
      return res.status(405).json({ error: "Method not allowed" });
    }
  } catch (error) {
    console.error("Error in API handler:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
