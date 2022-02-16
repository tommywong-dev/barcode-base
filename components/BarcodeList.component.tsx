import React, { useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Divider,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import moment from "moment";
import { BarcodeData } from "../interfaces/Barcode.interface";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  QueryConstraint,
  where,
} from "firebase/firestore";
import { db } from "../firebase";
import { TIME_FORMAT } from "../constants/TIME_FORMAT";
import { DbUser } from "../interfaces/DbUser.interface";
import { getUsers } from "../firebase/firestore";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TIME_RANGE } from "../constants/TIME_RANGE";

interface Filters {
  user: string;
  timeRange: string;
}
const BarcodeList = () => {
  const [barcodes, setBarcodes] = useState<BarcodeData[]>([]);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [selected, setSelected] = useState<Filters>({
    user: "",
    timeRange: TIME_RANGE.ALL_TIME,
  });

  const handleSelectFilter = (field: keyof Filters, value: string) => {
    setSelected({ ...selected, [field]: value });
  };

  const getFilters = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    const queryConstraints: QueryConstraint[] = [orderBy("timestamp", "desc")];
    if (selected.user)
      queryConstraints.push(where("name", "==", selected.user));

    const q = query(collection(db, "barcodes"), ...queryConstraints);
    const now = moment();

    const unsub = onSnapshot(q, (snapshot) => {
      const barcodes: BarcodeData[] = [];
      snapshot.forEach((doc) => {
        const barcodeData: BarcodeData = doc.data() as BarcodeData;
        if (!selected.timeRange || selected.timeRange === TIME_RANGE.ALL_TIME)
          return barcodes.push(barcodeData);

        switch (selected.timeRange) {
          case TIME_RANGE.TODAY:
            if (moment(barcodeData.timestamp).isSame(now, "day"))
              barcodes.push(barcodeData);
            break;
          case TIME_RANGE.THIS_WEEK:
            if (moment(barcodeData.timestamp).isSame(now, "week"))
              barcodes.push(barcodeData);
            break;
          case TIME_RANGE.THIS_MONTH:
            if (moment(barcodeData.timestamp).isSame(now, "month"))
              barcodes.push(barcodeData);
            break;
          case TIME_RANGE.THIS_YEAR:
            if (moment(barcodeData.timestamp).isSame(now, "year"))
              barcodes.push(barcodeData);
            break;
          default:
            break;
        }
      });
      setBarcodes(barcodes);
    });

    return () => unsub();
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
      </HStack>

      <VStack
        divider={<Divider />}
        align="start"
        padding="5"
        paddingBottom="24"
        width="100%"
        className="justify-start"
      >
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
