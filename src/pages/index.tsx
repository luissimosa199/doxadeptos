import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
import React, { useEffect } from "react";

const Index = () => {
  const router = useRouter();

  useEffect(() => {
    router.push("/properties");
  }, [router]);

  return (
    <div className="text-6xl p-12 min-h-screen font-bold">Redirecting...</div>
  );
};

export default Index;

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/properties",
      permanent: false,
    },
  };
}
