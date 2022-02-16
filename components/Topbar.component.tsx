import {
  Avatar,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React from "react";
import { signInGoogle, signOutGoogle } from "../firebase/auth";
import { useAuth } from "../providers/useAuth";

const Topbar = () => {
  const user = useAuth();

  return (
    <div className="bg-white shadow-md min-w-full flex justify-end py-2 px-4 md:py-5 md:px-10">
      <Menu>
        <MenuButton className="border-4 border-gray-200 rounded-full">
          <Avatar
            name={user.displayName || user.email || ""}
            src={user.photoURL || ""}
          />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={signOutGoogle}>Sign Out</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
};

export default Topbar;
