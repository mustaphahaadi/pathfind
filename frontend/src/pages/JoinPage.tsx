import { useState } from "react";
import RoleSelector from "../components/auth/RoleSelector";
import PlatformPromiseBanner from "../components/auth/PlatformPromiseBanner";
import type { AuthRole } from "../types/auth";

/** Rendered inside AuthLayout's <Outlet />, which supplies the header/footer shell. */
const JoinPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<AuthRole | null>(null);

  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          Create your Pathfind account
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/60">
          Choose how you want to participate in our open, voluntary tech
          mentorship community.
        </p>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <RoleSelector selectedRoleId={selectedRoleId} onSelect={setSelectedRoleId} />
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        <PlatformPromiseBanner />
      </div>
    </>
  );
};

export default JoinPage;
