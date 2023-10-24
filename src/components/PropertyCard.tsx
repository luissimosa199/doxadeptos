import {
  faPenToSquare,
  faVideoCamera,
  faMessage,
  faBoxArchive,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import router from "next/router";
import React, { FunctionComponent } from "react";
import { CldImage } from "next-cloudinary";
import { noProfileImage } from "@/utils/noProfileImage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleFavorite } from "@/utils/toggleFavorite";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { Property } from "@/db/models/PropertyModel";
import { CustomSession } from "@/pages/api/auth/[...nextauth]";

interface UserInterface {
  property: {
    title: string;
    email: string;
    image: string;
    _id: string;
    isArchived: boolean;
    slug: string;
  };
  session: CustomSession | null;
  favoritesLoading: boolean;
  isFavorites: boolean;
}

const PropertyCard: FunctionComponent<UserInterface> = ({
  property,
  session,
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
      className="py-4 space-y-4"
    >
      <div className="flex items-center gap-4">
        <div className="rounded-full h-[50px] min-w-[50px] border-2 overflow-hidden relative">
          <Link href={`/properties/${property.slug}`}>
            <CldImage
              alt={`foto de ${property.title}`}
              src={property.image || noProfileImage}
              fill
              className="absolute object-cover"
            />
          </Link>
        </div>
        <Link href={`/properties/${property.slug}`}>
          <div className="flex flex-col">
            <p className="text-lg font-medium">{property.title}</p>
            {property.isArchived && (
              <p className="text-sm text-slate-400 font-medium">(Occupied)</p>
            )}
          </div>
        </Link>

        <div className="ml-auto flex gap-2">
          <button
            className={`${
              favoritesLoading
                ? "animate-pulse"
                : isFavorites
                ? "text-yellow-500 sm:hover:text-black"
                : "text-black active:text-yellow-500 sm:hover:text-yellow-500"
            } w-6`}
            onClick={(e) => {
              e.preventDefault();
              if (!session?.user) {
                router.push("/login");
                return;
              }
              const method = isFavorites ? "DELETE" : "POST";
              favoriteMutation.mutate({ _id: property._id, method });
            }}
          >
            <FontAwesomeIcon
              size="lg"
              icon={isFavorites ? faStar : farStar}
            />
          </button>

          {session?.user && session?.role === "ADMIN" && (
            <>
              <button
                className="hover:text-green-500 transition"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(
                    `/chat/${(session?.user?.email as string).split("@")[0]}y${
                      property.title
                    }`
                  );
                }}
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faMessage}
                />
              </button>
              <button
                className="hover:text-blue-500 transition"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/videocall?name=${property.title}`);
                }}
              >
                <FontAwesomeIcon
                  size="lg"
                  icon={faVideoCamera}
                />
              </button>
              <button
                className="hover:text-blue-500 transition"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(`/properties/edit/${property._id}`);
                }}
              >
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  size="lg"
                />
              </button>
              <button
                className="hover:text-yellow-500 transition"
                onClick={(e) => {
                  e.preventDefault();
                  archiveMutation.mutate(property._id);
                }}
              >
                <FontAwesomeIcon
                  icon={faBoxArchive}
                  size="lg"
                />
              </button>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default PropertyCard;
