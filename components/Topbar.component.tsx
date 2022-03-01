import {
  Avatar,
  Box,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { newSignOut } from "../firebase/auth";
import { useAuth } from "../providers/useAuth";
import LogoComponent from "./Logo.component";

const Topbar = () => {
  const user = useAuth();

  // guard
  if (!user) return null;

  return (
    <Box className="bg-white shadow-md min-w-full flex justify-between items-center py-2 px-4 md:py-5 md:px-10">
      <LogoComponent />
      <Menu>
        <MenuButton className="border-4 border-gray-200 rounded-full">
          <Avatar
            name={user.displayName || user.email || ""}
            src={user.photoUrl || ""}
          />
        </MenuButton>
        <MenuList>
          <MenuGroup title={user.displayName || user.email || ""}>
            <MenuItem onClick={newSignOut}>Sign Out</MenuItem>
          </MenuGroup>
        </MenuList>
      </Menu>
    </Box>
  );
};

export default Topbar;
