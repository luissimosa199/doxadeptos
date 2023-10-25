import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";
import { nanoid } from "nanoid";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
  options: {
    allowMixed: 0,
  },
})
export class Contact {
  @prop({ default: () => nanoid(9) })
  _id: string;

  @prop()
  name: string;

  @prop()
  email: string;

  @prop()
  number: string;

  @prop()
  message: string;
}

export const ContactModel = getModelForClass(Contact);
