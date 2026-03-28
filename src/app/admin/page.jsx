"use client";

import { Button, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/Navbar";
import WinesTable from "./components/WinesTable";
import MerchTable from "./components/MerchTable";
import styles from "./admin.module.css";

const AdminPage = () => {
  const router = useRouter();
  // const { user, isLoaded } = useUser();
  // const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = React.useState(false);

  // React.useEffect(() => {
  //   if (!isLoaded) return;
  //   if (!user) {
  //     router.replace("/");
  //   }
  // }, [isLoaded, user, router]);

  const handleLogout = async () => {
    setIsSigningOut(true);

    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Failed to sign out");
      }

      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
      setIsSigningOut(false);
    }
  };

  // if (!isLoaded || !user) return null;

  const user = {
    firstName: "Admin",
    imageUrl: "https://via.placeholder.com/150",
  };

  return (
    <>
      <Navbar userImage={user.imageUrl} onLogout={handleLogout} />
      <div className={styles.page}>
        <h1>Welcome to the Admin Dashboard, {user.firstName}!</h1>
        <Typography variant="h5" gutterBottom>
          Lista de Vinos
        </Typography>
        <WinesTable />
        <Typography variant="h5" gutterBottom>
          Merch
        </Typography>
        <MerchTable />
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Signing out..." : "Sign Out"}
        </Button>
      </div>
    </>
  );
};

export default AdminPage;
