import {
  AppShell,
  Box,
  Button,
  Center,
  Header,
  Navbar,
  Text,
  Title,
} from "@mantine/core";
import type { NextPage } from "next";
import React from "react";
import BarcodeList from "../components/BarcodeList.component";
import LogoComponent from "../components/Logo.component";
import ScanButton from "../components/ScanButton.component";
import { signInGoogle } from "../firebase/auth";
import { useAuth } from "../providers/useAuth";
import HeaderComponent from "../components/Header.component";

const Home: NextPage = () => {
  const user = useAuth();

  return user.uid ? (
    <AppShell
      padding="md"
      header={<HeaderComponent />}
      sx={{ position: "relative" }}
      className="min-h-screen"
    >
      <BarcodeList />
      <ScanButton />
    </AppShell>
  ) : (
    <Center sx={{ flexDirection: "column", height: "100vh" }}>
      <LogoComponent />
      <Title order={3} sx={{ textAlign: "center", margin: "2rem 0" }}>
        Kindly log in to use the app
      </Title>
      <Button size="lg" onClick={signInGoogle}>
        Log In
      </Button>
    </Center>
  );
};

export default Home;
