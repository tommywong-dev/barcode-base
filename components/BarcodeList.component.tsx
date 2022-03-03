import React, { useCallback, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  Tooltip,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { BarcodeData } from "../interfaces/Barcode.interface";
import { orderBy, QueryConstraint, where } from "firebase/firestore";
import { TIME_FORMAT } from "../constants/TIME_FORMAT";
import { DbUser } from "../interfaces/DbUser.interface";
import { getBarcodesWith, getUsers } from "../firebase/firestore";
import { ChevronDownIcon, RepeatIcon } from "@chakra-ui/icons";
import { TIME_RANGE } from "../constants/TIME_RANGE";
import { useAuth } from "../providers/useAuth";

interface Filters {
  user: string;
  timeRange: string;
}
const BarcodeList = () => {
  const user = useAuth();

  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [selected, setSelected] = useState<Filters>({
    user: user?.displayName || "",
    timeRange: TIME_RANGE.TODAY,
  });

  const handleSelectFilter = (field: keyof Filters, value: string) => {
    setSelected({ ...selected, [field]: value });
  };

  const getFilters = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const getBarcodes = async () => {
    setBarcodes([]);

    // setup queries for retrieving barcodes data
    const queryConstraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
    if (selected.user)
      queryConstraints.push(where("name", "==", selected.user));

    // get data
    const barcodes: BarcodeData[] = await getBarcodesWith(queryConstraints);

    // if user did not select time range or selected ALL TIME, just use all the barcodes
    if (!selected.timeRange || selected.timeRange === TIME_RANGE.ALL_TIME)
      return setBarcodes(barcodes);

    // otherwise, filter them by time
    const now = moment();
    const filteredBarcodes = barcodes.filter((barcode) => {
      switch (selected.timeRange) {
        case TIME_RANGE.TODAY:
          if (moment(barcode.timestamp).isSame(now, "day")) return true;
          return false;
        case TIME_RANGE.THIS_WEEK:
          if (moment(barcode.timestamp).isSame(now, "week")) return true;
          return false;
        case TIME_RANGE.THIS_MONTH:
          if (moment(barcode.timestamp).isSame(now, "month")) return true;
          return false;
        case TIME_RANGE.THIS_YEAR:
          if (moment(barcode.timestamp).isSame(now, "year")) return true;
          return false;
        default:
          return false;
      }
    });
    setBarcodes(filteredBarcodes);
  };

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    getBarcodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected.user, selected.timeRange]);

  return (
    <VStack align="start" width="100%">
      <HStack padding="5">
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selected.user || "Users"}
          </MenuButton>
          <MenuList>
            {users.map(({ displayName, email, photoURL, uid }) => (
              <MenuItem
                key={uid}
                onClick={() => handleSelectFilter("user", displayName)}
              >
                <Avatar mr="3" src={photoURL} name={displayName} />
                <VStack align="start">
                  <Text fontSize="md">{displayName}</Text>
                  <Text fontSize="sm">{email}</Text>
                </VStack>
              </MenuItem>
            ))}
            <MenuItem onClick={() => handleSelectFilter("user", "")}>
              All Users
            </MenuItem>
          </MenuList>
        </Menu>
        <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
            {selected.timeRange || "Time Range"}
          </MenuButton>
          <MenuList>
            {Object.keys(TIME_RANGE).map((range) => (
              <MenuItem
                key={range}
                textTransform="capitalize"
                onClick={() =>
                  handleSelectFilter(
                    "timeRange",
                    TIME_RANGE[range as keyof typeof TIME_RANGE]
                  )
                }
              >
                {TIME_RANGE[range as keyof typeof TIME_RANGE].toLowerCase()}
              </MenuItem>
            ))}
          </MenuList>
        </Menu>

        <Tooltip title="Refresh">
          <IconButton
            aria-label="refresh"
            icon={<RepeatIcon />}
            onClick={getBarcodes}
          />
        </Tooltip>
      </HStack>

      <VStack
        divider={<Divider />}
        align="start"
        padding="5"
        paddingBottom="24"
        width="100%"
        className="justify-start"
      >
        <Text>Results: {barcodes.length}</Text>
        {barcodes.length ? (
          barcodes.map(({ name, barcode, timestamp }) => (
            <Stat key={barcode}>
              <StatLabel>{name}</StatLabel>
              <StatNumber>{barcode}</StatNumber>
              <StatHelpText>
                {moment(timestamp).format(TIME_FORMAT.VERBOSE)}
              </StatHelpText>
            </Stat>
          ))
        ) : (
          <Text fontSize="2xl">No Records</Text>
        )}
      </VStack>
    </VStack>
  );
};

export default BarcodeList;
