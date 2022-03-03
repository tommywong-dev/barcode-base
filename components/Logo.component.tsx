import React from "react";
import { Text, Box } from "@chakra-ui/react";

export default function LogoComponent() {
  return (
    <Text variant="h2" fontWeight="bold" textColor="blue.500">
      Barcode
      <Box display="inline" textColor="blue.700">
        Base
      </Box>
      <Box
        display="inline-block"
        width={2}
        height={2}
        ml={0.5}
        borderRadius="50%"
        backgroundColor="blue.500"
      />
    </Text>
  );
}
