import { Avatar, Box, Group, SelectItemProps, Text } from "@mantine/core";
import React, { forwardRef } from "react";

interface MySelectItemProps extends SelectItemProps {
  image: string;
  description: string;
}

const MySelectItem = forwardRef<HTMLDivElement, MySelectItemProps>(
  ({ image, label, description, ...others }, ref) => (
    <Box ref={ref} {...others} key={description}>
      <Group noWrap>
        <Avatar radius="xl" src={image} alt={label?.toString()}>
          {label}
        </Avatar>
        <Box>
          <Text>{label}</Text>
          <Text size="xs" color="dimmed">
            {description}
          </Text>
        </Box>
      </Group>
    </Box>
  )
);

MySelectItem.displayName = "MySelectItem";

export default MySelectItem;
