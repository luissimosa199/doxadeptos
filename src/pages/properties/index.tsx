import { useSession } from "next-auth/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Property, PropertyModel } from "@/db/models/PropertyModel";
import AsideMenu from "@/components/AsideMenu";
import PropertyCard from "@/components/PropertyCard";
import PropertiesFilters from "@/components/PropertiesFilters";
import { CustomSession } from "../api/auth/[...nextauth]";
import dbConnect from "@/db/dbConnect";

interface PropertyInterface {
  title: string;
  email: string;
  image: string;
  _id: string;
  tags: string[];
  isArchived: boolean;
  slug: string;
  details: string;
}

const Properties = ({
  initialPropertiesData,
}: {
  initialPropertiesData: PropertyInterface[];
}) => {
  const { data: session }: { data: CustomSession | null } = useSession();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState("");
  // const [showArchived, setShowArchived] = useState(false);
  const [filterByFavorites, setFilterByFavorites] = useState<boolean>(false);

  const fetchProperties = async () => {
    if (initialPropertiesData) return initialPropertiesData;

    const response = await fetch("/api/properties", {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  };

  const {
    data: properties,
    error,
    isLoading,
  } = useQuery(["properties"], fetchProperties, {
    initialData: initialPropertiesData,
    staleTime: 1000 * 60 * 5,
  });

  const {
    data: favorites,
    isLoading: favoritesLoading,
  }: { data: string[] | undefined; isLoading: boolean } = useQuery(
    ["favorites"],
    async () => {
      if (!session) {
        return [];
      }
      const response = await fetch(`/api/user/favorites`);
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Could not fetch favorites");
      }
    }
  );

  if (isLoading)
    return (
      <div className="mt-4 min-h-screen bg-white p-6 rounded-lg shadow-md animate-pulse">
        <ul className="divide-y divide-gray-200">
          {[...Array(6)].map((_, index) => (
            <li
              key={index}
              className="py-4 space-y-4"
            >
              <div className="flex items-center gap-4">
                {/* Skeleton for profile image */}
                <div className="rounded-full h-[150px] w-[150px] bg-gray-300"></div>
                {/* Skeleton for user name */}
                <div className="flex flex-col">
                  <div className="h-6 bg-gray-300 w-1/2 rounded"></div>
                </div>
                {/* Skeleton for video call icon */}
                <div className="h-6 w-6 bg-gray-300 rounded ml-4"></div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );

  if (error) return <p>Error {JSON.stringify(error)} </p>;

  const tags = Array.from(
    new Set(properties.flatMap((e: PropertyInterface) => e.tags))
  ) as string[];

  const filteredProperties = properties
    // .filter((property: Property) => {
    //   // If no filters are applied, take archived status into account
    //   if (!nameFilter && selectedTags.length === 0) {
    //     if (showArchived) {
    //       return property.isArchived === true;
    //     } else {
    //       return property.isArchived !== true; // handles both undefined and false cases
    //     }
    //   }
    //   return true; // If any filter is applied, we don't filter out by archived status here.
    // })
    .filter((property: PropertyInterface) => {
      // Handle name filtering
      return nameFilter
        ? property.title.toLowerCase().includes(nameFilter.toLowerCase())
        : true;
    })
    .filter((property: PropertyInterface) => {
      // Handle tag filtering
      return selectedTags.length > 0
        ? selectedTags.every((tag) => property.tags.includes(tag))
        : true;
    })
    .filter((property: PropertyInterface) => {
      // Handle favorites filtering
      return filterByFavorites && favorites
        ? favorites.includes(property._id)
        : true;
    })
    .sort((a: Property, b: Property) => {
      // If 'a' is archived and 'b' is not, 'a' comes last
      if (a.isArchived && !b.isArchived) return 1;
      // If 'b' is archived and 'a' is not, 'b' comes last
      if (b.isArchived && !a.isArchived) return -1;
      // Otherwise, no change in order
      return 0;
    });

  return (
    <div
      className={`mt-4 min-h-[130vh] bg-white p-6 rounded-lg shadow-md max-w-[850px] mx-auto`}
    >
      <div className="flex flex-col">
        <div className="my-4 2xl:absolute 2xl:left-8 2xl:p-8 bg-white ">
          <AsideMenu />
          <PropertiesFilters
            tags={tags}
            setSelectedTags={setSelectedTags}
            filterByFavorites={filterByFavorites}
            setFilterByFavorites={setFilterByFavorites}
          />
        </div>

        <div className="flex justify-between">
          <div>
            {session?.user && session?.role === "ADMIN" && (
              <Link
                className="w-fit inline-flex items-center p-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:border-blue-700 focus:shadow-outline-blue active:bg-blue-800 transition ease-in-out duration-150"
                href="/properties/register"
              >
                Post new property
              </Link>
            )}
          </div>

          {/* <button
            className="w-fit inline-flex items-center p-4 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-800 transition ease-in-out duration-150"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? "Available properties" : "Occupied properties"}
          </button> */}
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="p-2 mt-4 border rounded"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      <ul className="divide-y divide-gray-200">
        {properties.length === 0 && (
          <li className="py-4 space-y-4">
            <div className="flex items-center gap-4">
              <p>There&apos;s no apartment published</p>
            </div>
          </li>
        )}

        {filteredProperties.map((property: PropertyInterface, idx: number) => {
          return (
            <PropertyCard
              key={idx}
              property={property}
              favoritesLoading={favoritesLoading}
              isFavorites={
                Array.isArray(favorites) && favorites.includes(property._id)
              }
            />
          );
        })}
      </ul>
    </div>
  );
};

export default Properties;

export async function getServerSideProps() {
  await dbConnect();

  const initialPropertiesData = await PropertyModel.find()
    .select("email title image tags isArchived slug details")
    .sort({ createdAt: -1 })
    .lean();

  return {
    props: {
      initialPropertiesData,
    },
  };
}
