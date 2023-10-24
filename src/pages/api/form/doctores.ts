import dbConnect from "@/db/dbConnect";
import { ProspectsDocsModel } from "@/db/models/PropsectsDocsModel";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }
  await dbConnect();

  const formData = JSON.parse(req.body);

  try {
    const updatedDoc = await ProspectsDocsModel.findOneAndUpdate(
      { id: formData.id },
      {
        form_name: formData.name,
        tlf: formData.tlf,
        form_email: formData.email,
        response: true,
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: updatedDoc });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
