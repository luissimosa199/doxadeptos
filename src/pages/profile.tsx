import { useSession } from "next-auth/react";
import ProfileCard from "@/components/ProfileCard";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useState } from "react";
import PrimaryForm from "@/components/PrimaryForm";
import LastTenUserTimeline from "@/components/LastTenUserTimeline";
import { CustomSession } from "./api/auth/[...nextauth]";

const Profile = () => {
  const router = useRouter();
  const {
    data: session,
    status,
  }: { status: string; data: CustomSession | null } = useSession();
  const [addNewTimeline, setAddNewTimeline] = useState<boolean>(false);

  if (status === "loading") {
    return <div className="animate-pulse">Loading...</div>;
  }

  if (session && session.user) {
    return (
      <>
        <div className="p-8 bg-gray-50 space-y-12">
          <div className="flex gap-2 items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <h1 className="text-4xl font-bold text-gray-800 border-b-2 pb-3">
                Profile
              </h1>
            </div>
          </div>
          <ProfileCard />
          {session && session.role === "ADMIN" && (
            <div className="mt-6">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 border-b-2 pb-2">
                Latest posts
              </h2>
              <button
                className={`border-2 w-10 rounded p-2 ${
                  addNewTimeline ? "bg-gray-200" : "bg-white"
                } text-slate-600 transition`}
                onClick={(e) => {
                  e.preventDefault();
                  setAddNewTimeline(!addNewTimeline);
                }}
              >
                <FontAwesomeIcon icon={faPlus} />
              </button>
              {addNewTimeline && <PrimaryForm />}

              <LastTenUserTimeline username={session.user.email as string} />
            </div>
          )}
        </div>
      </>
    );
  }

  if (!session || !session.user) {
    router.push("/login");
    return null;
  }
};

export default Profile;
