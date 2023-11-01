import dbConnect from "@/db/dbConnect";
import { ContactModel } from "@/db/models/ContactModel";
import type { NextApiRequest, NextApiResponse } from "next";
import sendgrid from "@sendgrid/mail";

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

    sendgrid.setApiKey(process.env.SEND_GRID_API_KEY as string);

    const options = {
      from: "javier.doxadoctor@gmail.com",
      to: "marceloj@gmail.com",
      subject: `Contacto de flats.doxadoctor.com`,
      html: `<ul><li>NOMBRE: ${name}</li> <li>EMAIL: ${email}</li> <li>NUMERO: ${number}</li> <li>MENSAJE: ${message}</li></ul>}`,
    };

    await contact.save();
    sendgrid.send(options);

    res.status(200).json({ message: "Success" });
  } else {
    res.status(405).end();
  }
};

export default handler;
