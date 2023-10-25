import dbConnect from "@/db/dbConnect";
import { ContactModel } from "@/db/models/ContactModel";
import type { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const { name, email, number, message } = req.body;

    await dbConnect();

    const contact = new ContactModel({
      name: name || "",
      email: email || "",
      number: number || "",
      message: message || "",
    });

    await contact.save();

    res.status(200).json({ message: "Success" });
  } else {
    res.status(405).end();
  }
};

export default handler;
