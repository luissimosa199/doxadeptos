import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import { ObjectId } from "mongodb";
import { nanoid } from "nanoid";

@modelOptions({
  schemaOptions: { timestamps: true },
  options: {
    allowMixed: 0,
  },
})
export class DeletedProperty {
  @prop({ default: () => nanoid(9) })
  _id: string | ObjectId;

  @prop({ required: true })
  title: string;

  @prop()
  email?: string;

  @prop()
  deletedAt: Date;

  @prop()
  tlf?: string;

  @prop()
  details?: string;

  @prop()
  image?: string;

  @prop()
  tags?: string[];

  @prop()
  photos?: string[];

  @prop({ required: true })
  user: string;
}

export const DeletedPropertyModel = getModelForClass(DeletedProperty);
