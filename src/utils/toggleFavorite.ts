export const toggleFavorite = async ({
  _id,
  method,
}: {
  _id: string;
  method: "DELETE" | "POST";
}) => {
  const response = await fetch(`/api/user/favorites`, {
    method,
    body: _id,
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};
