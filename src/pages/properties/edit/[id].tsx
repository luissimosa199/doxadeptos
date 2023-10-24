import InputList from "@/components/FlexInputList";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditProperty = () => {
  const router = useRouter();
  const { id } = router.query;
  const { status } = useSession();
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [tags, setTags] = useState<string[]>([]);
  const [property, setProperty] = useState<any>(null);

  const fetchData = async (id: string) => {
    const response = await fetch(`/api/properties?id=${id}`, { method: "GET" });
    const data = await response.json();
    setProperty(data);
    setTags(data.tags);
    return data;
  };

  useEffect(() => {
    if (id) {
      fetchData(id as string);
    }
  }, [id]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    if (status === "unauthenticated") {
      setErrorMessage("You need to be logged in to edit a property");
      return;
    }

    const response = await fetch(`/api/properties?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...Object.fromEntries(formData), tags }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (response.ok) {
      router.push("/properties");
    } else {
      setErrorMessage(data.error);
      setIsLoading(false);
    }
  };

  const deleteProperty = async (_id: string) => {
    const response = await fetch(`/api/properties?id=${_id}`, {
      method: "DELETE",
    });
    return response;
  };

  const deleteMutation = useMutation(
    async (_id: string) => deleteProperty(_id),
    {
      onMutate: (_id: string) => {
        const previousPropertiesData = queryClient.getQueryData<any[]>([
          "properties",
        ]);

        queryClient.setQueryData(["properties"], (oldData: any[] | undefined) =>
          oldData?.filter((property) => property._id !== _id)
        );

        return { previousPropertiesData };
      },
      onError: (error, variables, context: any) => {
        console.log(error);
        queryClient.setQueryData(
          ["properties"],
          context.previousPropertiesData
        );
      },
      onSuccess: () => {
        router.push("/properties");
      },
    }
  );

  if (!router.isReady || !property) {
    return <p className="text-xl p-4 min-h-screen">Loading...</p>;
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-96"
        onSubmit={handleSubmit}
      >
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="title"
          >
            Title
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="title"
            type="text"
            id="title"
            defaultValue={property.title}
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="email"
            type="email"
            id="email"
            defaultValue={property.email}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="tlf"
          >
            Contact number
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="tlf"
            type="tel"
            id="tlf"
            defaultValue={property.tlf}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="details"
          >
            Details
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            name="details"
            type="text"
            id="details"
            defaultValue={property.details}
          />
        </div>

        <div className="mb-4">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="details"
          >
            Tags
          </label>
          <InputList
            type={"tag"}
            inputList={tags}
            setInputList={setTags}
            showState={true}
          />
        </div>

        {errorMessage && (
          <div className="mb-6">
            <p className="text-sm text-red-600 font-semibold text-center">
              Error: {errorMessage}
            </p>
          </div>
        )}
        <div className="flex flex-row gap-1 items-center justify-between">
          <button
            className="w-1/3 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
            type="button"
            onClick={async (e) => {
              e.preventDefault();

              const result = await Swal.fire({
                title: "Are you sure?",
                text: "The property will be deleted",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Delete",
                cancelButtonText: "Go back",
              });

              if (result.isConfirmed) {
                deleteMutation.mutate(id as string);
                Swal.fire("Deleted!", "Property deleted", "success");
              }
            }}
          >
            <FontAwesomeIcon
              size="lg"
              icon={faTrashCan}
            />
          </button>
          <button
            className=" w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update property"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProperty;
