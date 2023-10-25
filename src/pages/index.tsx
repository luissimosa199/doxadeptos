import { GetServerSidePropsContext } from "next/types";
import React from "react";

const Index = () => {
  return (
    <div className="text-6xl p-12 min-h-screen font-bold">Redirecting...</div>
  );
};

export default Index;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  context.res.writeHead(302, { Location: "/properties" });
  context.res.end();

  return {
    props: {},
  };
}
