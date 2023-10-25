import { DeletedUserPhoto } from "./deletedUserPhotosModel";
import { getModelForClass } from "@typegoose/typegoose";
import { UserAgent } from "./userAgentModel";

export const DeletedUserPhotoModel = getModelForClass(DeletedUserPhoto);
export const UserAgentModel = getModelForClass(UserAgent);

// add other models here
