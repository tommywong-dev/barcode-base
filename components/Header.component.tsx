import { ActionIcon, Avatar, Button, Header, Menu } from "@mantine/core";
import React from "react";
import { signOutGoogle } from "../firebase/auth";
import { useAuth } from "../providers/useAuth";
import LogoComponent from "./Logo.component";

const HeaderComponent = () => {
  const user = useAuth();
  const name = user.displayName || user.email || "";

  return (
    <Header
      height={60}
      padding="sm"
      sx={{ display: "flex", justifyContent: "space-between" }}
    >
      <LogoComponent />
      <Menu
        control={
          <Avatar
            alt={name}
            src={user.photoURL || ""}
            radius="xl"
            sx={{
              border: "2px solid #eee",
              cursor: "pointer",
            }}
          >
            {name}
          </Avatar>
        }
      >
        <Menu.Label>{name}</Menu.Label>
        <Menu.Item onClick={signOutGoogle}>Sign Out</Menu.Item>
      </Menu>
    </Header>
  );
};

export default HeaderComponent;
