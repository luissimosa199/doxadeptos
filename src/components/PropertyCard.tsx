import Link from "next/link";
import React, { FunctionComponent } from "react";
import { CldImage } from "next-cloudinary";
import { noProfileImage } from "@/utils/noProfileImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "@/utils/toggleFavorite";
import { Property } from "@/db/models/PropertyModel";
import PropertyCardButtons from "./PropertyCardButtons";
import ShareButtons from "./ShareButtons";

interface UserInterface {
  property: {
    title: string;
    email: string;
    image: string;
    _id: string;
    isArchived: boolean;
    slug: string;
    details: string;
  };
  favoritesLoading: boolean;
  isFavorites: boolean;
}

const PropertyCard: FunctionComponent<UserInterface> = ({
  property,
  favoritesLoading,
  isFavorites,
}) => {
  const queryClient = useQueryClient();

  const handleArchiveProperty = async (id: string) => {
    const response = await fetch(`/api/properties?id=${id}`, {
      method: "PATCH",
    });

    const data = await response.json();
    return data;
  };

  const archiveMutation = useMutation(handleArchiveProperty, {
    onMutate: (propertyId) => {
      const previousProperties = queryClient.getQueryData(["properties"]);

      queryClient.setQueryData(
        ["properties"],
        (current: Property[] | undefined) => {
          return current?.map((property) => {
            if (property._id === propertyId) {
              return {
                ...property,
                isArchived: property.hasOwnProperty("isArchived")
                  ? !property.isArchived
                  : true,
              };
            }
            return property;
          });
        }
      );
      return { previousProperties };
    },
    onError: (err, propertyId, context: any) => {
      if (context?.previousProperties) {
        queryClient.setQueryData(["properties"], context.previousProperties);
      }
    },
  });

  const favoriteMutation = useMutation(toggleFavorite, {
    onMutate: ({ _id, method }) => {
      queryClient.cancelQueries(["favorites"]);
      const previousFavorites =
        queryClient.getQueryData<string[]>(["favorites"]) || [];

      if (Array.isArray(previousFavorites)) {
        if (method === "DELETE") {
          queryClient.setQueryData(
            ["favorites"],
            previousFavorites.filter((fav) => fav !== _id)
          );
        } else {
          queryClient.setQueryData(["favorites"], [...previousFavorites, _id]);
        }
      }

      return { previousFavorites };
    },
  });

  return (
    <li
      key={property._id}
      className="my-4 shadow-md sm:shadow-none "
    >
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="h-[300px] w-full sm:w-auto sm:min-w-[400px] overflow-hidden relative">
          <Link href={`/properties/${property.slug}`}>
            <CldImage
              alt={`foto de ${property.title}`}
              src={property.image || noProfileImage}
              fill
              className="absolute object-cover"
            />
          </Link>
        </div>
        <div className="flex flex-col gap-2 pb-4 w-full px-2 justify-between sm:h-[300px] sm:overflow-hidden sm:px-0 sm:w-auto sm:self-start">
          <div className="flex flex-wrap gap-2">
            <Link href={`/properties/${property.slug}`}>
              <div className="flex flex-col">
                <p className="text-lg md:text-3xl font-medium">
                  {property.title}
                </p>
                {property.isArchived && (
                  <p className="text-sm text-slate-400 font-medium">
                    (Occupied)
                  </p>
                )}
              </div>
            </Link>
            <PropertyCardButtons
              favoritesLoading={favoritesLoading}
              isFavorites={isFavorites}
              archiveMutation={archiveMutation}
              favoriteMutation={favoriteMutation}
              property={property}
            />
          </div>
          <div className="hidden sm:block">
            {`${property.details.substring(0, 150)}${
              property.details.length > 150 ? "..." : ""
            }`}
          </div>
          <ShareButtons
            url={`${process.env.NEXT_PUBLIC_BASE_URL}/properties/${property.slug}`}
            title={property.title}
          />
        </div>
      </div>
    </li>
  );
};

export default PropertyCard;
