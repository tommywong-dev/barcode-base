import { Button, Text } from "@chakra-ui/react";
import React from "react";
import { signInGoogle } from "../firebase/auth";

export default function Login() {
  return (
    <>
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
    </>
  );
}
