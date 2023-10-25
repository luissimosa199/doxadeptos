import React, { FunctionComponent } from "react";
import {
  faPenToSquare,
  faVideoCamera,
  faMessage,
  faBoxArchive,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import router from "next/router";
import { CustomSession } from "@/pages/api/auth/[...nextauth]";
import { useSession } from "next-auth/react";
import { UseMutationResult } from "@tanstack/react-query";

interface PropertyCardButtonsProps {
  favoritesLoading: boolean;
  isFavorites: boolean;
  favoriteMutation: UseMutationResult<
    any,
    unknown,
    {
      _id: string;
      method: "DELETE" | "POST";
    },
    {
      previousFavorites: string[];
    }
  >;
  archiveMutation: UseMutationResult<any, unknown, string, any>;
  property: {
    title: string;
    email: string;
    image: string;
    _id: string;
    isArchived: boolean;
    slug: string;
  };
}

const PropertyCardButtons: FunctionComponent<PropertyCardButtonsProps> = ({
  favoritesLoading,
  isFavorites,
  favoriteMutation,
  archiveMutation,
  property,
}) => {
  const { data: session }: { data: CustomSession | null } = useSession();

  return (
    <div className="flex gap-2">
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
  );
};

export default PropertyCardButtons;
