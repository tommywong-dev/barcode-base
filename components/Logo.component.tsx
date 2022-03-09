import React from "react";
import { Text, Box, Title } from "@mantine/core";

export default function LogoComponent() {
  return (
    <Title
      order={2}
      sx={(theme) => ({ color: theme.colors.blue[4], display: "inline" })}
    >
      Barcode
      <Box sx={(theme) => ({ color: theme.colors.blue[7], display: "inline" })}>
        Base
      </Box>
      <Box
        sx={(theme) => ({
          display: "inline-block",
          width: 12,
          height: 12,
          marginLeft: 6,
          borderRadius: "50%",
          backgroundColor: theme.colors.blue[4],
        })}
      />
    </Title>
  );
}
