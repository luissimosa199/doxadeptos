import { modelOptions, prop, getModelForClass } from "@typegoose/typegoose";

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class ProspectsDocs {
  @prop()
  id: string;

  @prop()
  name: string;

  @prop()
  tlf?: string;

  @prop()
  email: string;

  @prop()
  form_name?: string;

  @prop()
  form_email?: string;

  @prop({ default: false })
  response: boolean;
}

export const ProspectsDocsModel = getModelForClass(ProspectsDocs);
