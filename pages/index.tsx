import { Box } from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import BarcodeList from "../components/BarcodeList.component";
import Login from "../components/Login.component";
import Logo from "../components/Logo.component";
import ScanButton from "../components/ScanButton.component";
import Topbar from "../components/Topbar.component";
import { useAuth } from "../providers/useAuth";

const Home: NextPage = () => {
  const user = useAuth();

  return user && user.uid ? (
    <Box position="relative" className="min-h-screen">
      <Topbar />
      <BarcodeList />
      <ScanButton />
    </Box>
  ) : (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDir="column"
      height="100vh"
    >
      <Logo />
      <Login />
    </Box>
  );
};

export default Home;
