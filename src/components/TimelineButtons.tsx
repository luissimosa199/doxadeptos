import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { FunctionComponent } from "react";
import Swal from "sweetalert2";

interface TimelineButtonsProps {
  _id: string;
  authorId: string;
  username: string;
}

const TimelineButtons: FunctionComponent<TimelineButtonsProps> = ({
  _id,
  authorId,
  username,
}) => {
  const queryClient = useQueryClient();

  const handleDeleteTimeline = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();

    try {
      const willDelete = await Swal.fire({
        title: "Are you sure?",
        text: "This post cannot be recovered once you confirm",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Delete",
        cancelButtonText: "Go back",
        reverseButtons: true,
      });

      if (willDelete.isConfirmed) {
        const response = await fetch(
          `/api/timeline/${_id}${
            username !== authorId ? "?username=" + authorId : ""
          }`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          const data = await response.json();
          const prevData = queryClient.getQueryData(["timelines", authorId]);
          queryClient.invalidateQueries(["timelines", authorId]);
          queryClient.invalidateQueries([authorId, "propertyTimelines"]);

          Swal.fire({
            title: "Post deleted",
            icon: "success",
          });
        } else {
          Swal.fire({
            title: `Error: ${response.status} ${response.statusText}`,
            icon: "error",
          });
        }
      }
    } catch (error) {
      console.error("Error: ", error);

      Swal.fire({
        title: `Error: ${JSON.stringify(error)}`,
        icon: "error",
      });
    }
  };

  return (
    <div>
      <Link
        className="text-blue-500 w-6 h-6 hover:text-blue-700 transition ease-in-out duration-150"
        href={`/nota/editar/${_id}${
          username !== authorId
            ? "?username=" + encodeURIComponent(authorId)
            : ""
        }`}
      >
        <FontAwesomeIcon
          icon={faPenToSquare}
          size="lg"
        />
      </Link>
      <button
        className="w-5 h-5"
        onClick={handleDeleteTimeline}
      >
        <FontAwesomeIcon
          icon={faTrashCan}
          size="lg"
          className="text-red-500 hover:text-red-700 transition ease-in-out duration-150"
        />
      </button>
    </div>
  );
};

export default TimelineButtons;
