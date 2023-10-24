import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
export class Property {
  @prop({ default: () => nanoid(9) })
  _id: string | ObjectId;

  @prop({ required: true })
  title: string;

  @prop()
  email?: string;

  @prop()
  tlf?: string;

  @prop()
  details?: string;

  @prop()
  slug: string;

  @prop()
  image?: string;

  @prop()
  tags?: string[];

  @prop()
  photos?: string[];

  @prop({ default: false })
  isArchived?: boolean;

  @prop({ required: true })
  user: string;
}

export const PropertyModel = getModelForClass(Property);
