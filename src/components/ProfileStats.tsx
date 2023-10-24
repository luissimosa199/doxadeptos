import { useQuery } from "@tanstack/react-query";
import React from "react";

const ProfileStats = () => {
  const { data, isLoading, error } = useQuery(["userStats"], async () => {
    const response = await fetch(
      "/api/user_agent_info?username=luissimosaarg@gmail.com",
      {
        method: "GET",
      }
    );

    const data = await response.json();
    return data;
  });

  if (isLoading) {
    return (
      <div>
        <p className="italic text-gray-600">Loading stats...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <p className="italic text-gray-600">Error: {JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div>
      <p className="italic text-gray-600">
        Visits to your profile: {data.visitsCount}
      </p>
      <p className="italic mb-6 text-gray-600">
        Properties: {data.propertiesCount}
      </p>
    </div>
  );
};

export default ProfileStats;
