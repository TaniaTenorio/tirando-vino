"use client";

import { useClerk, useUser } from "@clerk/nextjs";
import { Button } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

const AdminPage = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  React.useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/");
    }
  }, [isLoaded, user, router]);

  const handleLogout = async () => {
    setIsSigningOut(true);
    await signOut();
    router.replace("/");
  };

  if (!isLoaded || !user) return null;

  return (
    <>
      <h1>Admin Page</h1>
      <p>Only accessible to authenticated users.</p>
      <Button
        variant="contained"
        color="primary"
        onClick={handleLogout}
        disabled={isSigningOut}
      >
        {isSigningOut ? "Signing out..." : "Sign Out"}
      </Button>
    </>
  );
};

export default AdminPage;
