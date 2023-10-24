import useTrackUserAgent from "@/hooks/useTrackUserAgent";
import { useRouter } from "next/router";
import React from "react";

const Funcion = () => {
  const router = useRouter();
  const { funcion } = router.query;

  useTrackUserAgent();

  return (
    <div className="min-h-screen flex justify-center items-center">
      <h1 className="text-6xl">
        ¡Gracias por su interés en{" "}
        {router.isReady && (funcion as string).replaceAll("_", " ")}, estamos
        trabajando en ello!
      </h1>
    </div>
  );
};

export default Funcion;
