import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "../../db/dbConnect"; // Adjust the path to your MongoDB connection utility
import { UserModel } from "../../db/models/userModel"; // Adjust the path to your User model
import bcrypt from "bcrypt";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end(); // Method Not Allowed
  }

  const { name, email, password } = req.body;

  // Input validation (you may want to add more comprehensive checks)
  if (!name || !email || !password) {
    return res.status(400).json({ error: "Incomplete required fields." });
  }

  // Connect to the database using dbConnect
  await dbConnect();

  try {
    // Check if the user already exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res
        .status(409)
        .json({ error: "A user with the same email already exists." });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const role = email === "marceloj@gmail.com" ? "ADMIN" : "USER";

    const user = new UserModel({ name, email, password: hashedPassword, role });
    await user.save();

    return res.status(201).json({ message: "User correctly registered." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: `Error: ${error}` });
  }
}
