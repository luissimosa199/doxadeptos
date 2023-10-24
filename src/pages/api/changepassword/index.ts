import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../../db/dbConnect";
import { UserModel } from "../../../db/models/userModel";
import bcrypt from "bcrypt";
import { VerifyCodeModel } from "@/db/models/VerifyCodeModel";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { email, newPassword, mailValidated } = req.body;

  if (!mailValidated) {
    return res.status(400).json({ error: "Email not validated." });
  }

  // Input validation
  if (!email || !newPassword) {
    return res.status(400).json({ error: "Required fields incomplete." });
  }

  await dbConnect();

  try {
    const existingUser = await UserModel.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ error: "User not found." });
    }

    // Hash the new password and update the user's password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    existingUser.password = hashedPassword;
    await existingUser.save();

    await VerifyCodeModel.deleteMany({ email: email });

    return res.status(200).json({ message: "Password updated." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Error: ${error}` });
  }
}
