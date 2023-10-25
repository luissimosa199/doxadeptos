import dbConnect from "@/db/dbConnect";
import React, { ChangeEvent, FunctionComponent, useState } from "react";
import { GetServerSidePropsContext } from "next";
import UserPhotos from "@/components/UserPhotos";
import {
  faArrowLeft,
  faEnvelope,
  faPhone,
  faUser,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import Image from "next/image";
import PhotoInput from "@/components/PhotoInput";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { handleFileAdding, uploadImages } from "@/utils/formHelpers";
import ProfilePicture from "@/components/ProfilePicture";
import mongoose from "mongoose";
import { PropertyModel } from "@/db/models/PropertyModel";
import { useSession } from "next-auth/react";
import { CustomSession } from "../api/auth/[...nextauth]";
import HeadMetaTags from "@/components/HeadMetaTags";

interface PropertyPageProps {
  propertyData?: {
    _id: string;
    title: string;
    email: string;
    tlf: string;
    details: string;
    image: string;
    slug: string;
  };
}

const Property: FunctionComponent<PropertyPageProps> = ({ propertyData }) => {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [newImages, setNewImages] = useState<string[]>([]);
  const [imageUploadPromise, setImageUploadPromise] =
    useState<Promise<any> | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [addNewTimeline, setAddNewTimeline] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const { data: session }: { data: CustomSession | null } = useSession();

  const uploadPhotosMutation = useMutation(
    (photos: string[]) => uploadUserPhotos(photos, propertyData?._id as string),
    {
      onMutate: (newPhotos: string[]) => {
        const previousData = queryClient.getQueryData<string[]>([
          "propertyPhotos",
          propertyData?._id,
        ]);
        queryClient.setQueryData<string[]>(
          ["propertyPhotos", propertyData?._id],
          (oldData = []) => {
            return [...oldData, ...newPhotos];
          }
        );
        return { previousData };
      },
      onSuccess: () => {
        setNewImages([]);
        setUploadedImages([]);
        setImageUploadPromise(null);
      },
      onError: (_: any, __: any, context: any) => {
        queryClient.setQueryData(
          ["propertyPhotos", propertyData?._id],
          context.previousData
        );
      },
    }
  );

  const uploadUserPhotos = async (photos: string[], userId: string) => {
    const response = await fetch(`/api/properties/photos/?userId=${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ photos }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Something went wrong");
    }

    return response.json();
  };

  const handleChangeAvatar = async (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();

    queryClient.cancelQueries([propertyData?._id, "profilePicture"]);
    try {
      const file = event.target.files?.[0];
      if (!file) return;

      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = function () {
          resolve(reader.result as string);
        };
        reader.onerror = function () {
          reject(new Error("Failed to read the file"));
        };
        reader.readAsDataURL(file);
      });
      queryClient.setQueryData([propertyData?._id, "profilePicture"], {
        image: dataUrl,
      });
      const avatarArr = await uploadImages(event);
      const avatarUrl = avatarArr![0];

      const response = await fetch(
        `/api/properties/avatar/?userId=${encodeURIComponent(
          propertyData?._id as string
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ image: avatarUrl }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(
          data.error || `Server responded with ${response.status}`
        );
      }

      return;
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  const handleUploadImages = async (event: ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    await handleFileAdding(event, setNewImages);

    setIsUploading(true);

    try {
      const urls = (await uploadImages(event)) as string[];
      setImageUploadPromise(Promise.resolve(urls));
      setUploadedImages((prevUrls) => [...prevUrls, ...urls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    queryClient.cancelQueries(["propertyPhotos", propertyData?._id]);

    const uploadedUrls = await imageUploadPromise;
    if (uploadedUrls && uploadedUrls.length) {
      uploadPhotosMutation.mutate(uploadedUrls);
    }
  };

  const handleDeleteImage =
    (index: number) =>
    (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      event.preventDefault();
      const newUploadedImages = uploadedImages.filter(
        (_, photoIndex) => photoIndex !== index
      );
      setUploadedImages(newUploadedImages);
      const updatedNewImages = newImages.filter(
        (_, imgIndex) => imgIndex !== index
      );
      setNewImages(updatedNewImages);
    };

  return (
    <div className="py-8 md:p-8 bg-gray-50 space-y-12">
      <HeadMetaTags
        timelineName={propertyData?.title as string}
        timeLineUrl={`${process.env.BASE_URLBASE_URL}/properties/${propertyData?.slug}`}
        siteName={"doxadeptos"}
      />
      <div className="flex gap-2 ml-2 items-center">
        <Link
          href="/properties"
          className="w-4 h-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </Link>
        <h1 className="text-4xl font-bold text-gray-800 border-b-2 pb-3">
          {propertyData?.title}
        </h1>
      </div>
      <div className="max-w-[850px] mx-auto">
        <div className="flex flex-col justify-around items-center border rounded-lg py-6 md:p-6 bg-white shadow-lg">
          <div className="flex flex-col items-center lg:flex-row gap-2 px-2">
            <div className="min-h-[128px] flex flex-col items-center relative">
              <ProfilePicture
                h="h-[150px]"
                w="w-[150px]"
                type="properties"
                userId={propertyData?._id as string}
              />
              {session?.user && session?.role === "ADMIN" && (
                <div className="border-2 absolute bottom-0 left-0 bg-white h-12 w-12 rounded-full overflow-hidden flex justify-center">
                  <PhotoInput
                    handleUploadImages={handleChangeAvatar}
                    variant="small"
                    id="profilepicture"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col space-y-4 my-6">
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faUser}
                  className="w-6 h-6 text-gray-600"
                />
                <p className="text-lg text-gray-800">{propertyData?.details}</p>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="w-6 h-6 text-gray-600"
                />
                <p className="text-lg text-gray-800">{propertyData?.tlf}</p>
              </div>
              <div className="flex items-center space-x-4">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="w-6 h-6 text-gray-600"
                />
                <p className="text-lg text-gray-800">{propertyData?.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl mt-2 ml-2 font-semibold text-gray-800 border-b-2 pb-3">
              Photos:
            </h2>
            <UserPhotos
              userId={propertyData?._id as string}
              queryKey={["propertyPhotos", propertyData?._id as string]}
            />
            {session?.user && session?.role === "ADMIN" && (
              <div className="w-24 mx-auto flex justify-center">
                <PhotoInput
                  handleUploadImages={handleUploadImages}
                  id="propertyphotos"
                  variant="small"
                />
              </div>
            )}
            <div className="mt-4 space-y-4">
              {newImages &&
                newImages.map((e: string, index: number) => {
                  const isVideo = e.includes("data:video/mp4");
                  return (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-100 p-4 rounded-md"
                    >
                      <button
                        onClick={handleDeleteImage(index)}
                        className="bg-red-500 text-white p-2 w-8 h-8 rounded-full hover:bg-red-600 flex justify-center items-center transition duration-300"
                      >
                        <FontAwesomeIcon
                          className="w-8"
                          icon={faX}
                        />
                      </button>
                      {isVideo ? (
                        <video
                          controls
                          width="200"
                          height="200"
                          className="rounded mx-auto"
                        >
                          <source
                            src={e}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <Image
                          src={e}
                          alt=""
                          width={200}
                          height={200}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
            {newImages.length > 0 && (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isUploading}
                className="mt-4 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isUploading ? "Subiendo..." : "Subir"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Property;

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    await dbConnect();

    const { id } = context.query;

    let queryId;
    if (mongoose.Types.ObjectId.isValid(id as string)) {
      queryId = new mongoose.Types.ObjectId(id as string);
    } else {
      queryId = id as string;
    }

    const property = await PropertyModel.findOne({ slug: queryId })
      .select("title email tlf details image _id slug")
      .lean();

    if (property) {
      const propertyData = {
        _id: property._id.toString(),
        title: property.title,
        email: property.email,
        tlf: property.tlf,
        details: property.details,
        image: property.image || "",
        photos: property.photos || [],
      };
      return {
        props: {
          propertyData,
        },
      };
    }

    throw new Error("error");
  } catch (error) {
    console.error(error);
    return {
      notFound: true,
    };
  }
};
