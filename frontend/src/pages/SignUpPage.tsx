import { useState } from "react";
import AuthModeToggle from "../components/auth/AuthModeToggle";
import RoleSelector from "../components/auth/RoleSelector";
import SignUpForm from "../components/auth/SignUpForm";
import PlatformPromiseBanner from "../components/auth/PlatformPromiseBanner";
import { roleOptions } from "../data/roleOptions";
import type { AuthRole } from "../types/auth";

/** Rendered inside AuthLayout's <Outlet />, which supplies the header/footer shell. */
const SignUpPage = () => {
  const [selectedRoleId, setSelectedRoleId] = useState<AuthRole>("mentee");
  const selectedRole =
    roleOptions.find((role) => role.id === selectedRoleId) ?? roleOptions[0];

  return (
    <>
      <div className="mx-auto max-w-3xl text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent-green/10 px-3 py-1.5 text-xs font-semibold tracking-wide text-accent-green">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-green" />
          JOIN PATHFIND &middot; 100% FREE MENTORSHIP
        </span>

        <h1 className="mt-5 text-3xl font-extrabold leading-tight text-ink sm:text-4xl lg:text-[2.75rem]">
          Create your Pathfind account
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-base leading-relaxed text-ink/60">
          Choose how you want to participate in our open, voluntary tech
          mentorship community.
        </p>

        <div className="mt-7 flex justify-center">
          <AuthModeToggle active="sign-up" />
        </div>
      </div>

      <div className="mx-auto mt-10 max-w-4xl">
        <RoleSelector
          selectedRoleId={selectedRoleId}
          onSelect={setSelectedRoleId}
        />
      </div>

      <div className="mx-auto mt-8 max-w-2xl">
        <SignUpForm role={selectedRole} />
      </div>

      <div className="mx-auto mt-6 max-w-2xl">
        <PlatformPromiseBanner />
      </div>
    </>
  );
};

export default SignUpPage;
