import { Box, Button, Text } from "@chakra-ui/react";
import type { NextPage } from "next";
import React from "react";
import BarcodeList from "../components/BarcodeList.component";
import LogoComponent from "../components/Logo.component";
import ScanButton from "../components/ScanButton.component";
import Topbar from "../components/Topbar.component";
import { signInGoogle } from "../firebase/auth";
import { useAuth } from "../providers/useAuth";

const Home: NextPage = () => {
  const user = useAuth();

  return user.uid ? (
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
      <LogoComponent />
      <Text fontSize="3xl" padding="5" textAlign="center">
        Kindly log in to use the app
      </Text>
      <Button
        variant="solid"
        colorScheme="blue"
        size="lg"
        onClick={signInGoogle}
      >
        Log In
      </Button>
    </Box>
  );
};

export default Home;
