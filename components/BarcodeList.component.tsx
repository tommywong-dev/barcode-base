import React, { useEffect, useState } from "react";
import {
  Avatar,
  Divider,
  Group,
  ActionIcon,
  Text,
  Tooltip,
  Title,
  Box,
  Select,
  TextInput,
  Grid,
} from "@mantine/core";
import moment from "moment";
import { BarcodeData } from "../interfaces/Barcode.interface";
import { orderBy, QueryConstraint, where } from "firebase/firestore";
import { TIME_FORMAT } from "../constants/TIME_FORMAT";
import { DbUser } from "../interfaces/DbUser.interface";
import { getBarcodesWith, getUsers } from "../firebase/firestore";
import {
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  ReloadIcon,
} from "@radix-ui/react-icons";
import { DATE_OPTION } from "../constants/DATE_OPTION";
import { useAuth } from "../providers/useAuth";
import { DatePicker, DateRangePicker } from "@mantine/dates";
import MySelectItem from "./MySelectItem.component";
import { useBooleanToggle, useForm, useListState } from "@mantine/hooks";
import { motion } from "framer-motion";
import ScanButton from "./ScanButton.component";

const BarcodeList = () => {
  const user = useAuth();

  const [showFilter, toggleFilter] = useBooleanToggle(false);
  const searchForm = useForm({
    initialValues: {
      barcode: "",
    },
  });

  const [barcodes, barcodesHandler] = useListState<BarcodeData>([]);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(user.uid);
  const [selectedDateOption, setSelectedDateOption] = useState<string | null>(
    DATE_OPTION.TODAY
  );
  const [date, setDate] = useState<Date | null>(new Date());
  const [dateRange, setDateRange] = useState<[Date | null, Date | null]>([
    new Date(),
    new Date(),
  ]);

  const getFilters = async () => {
    const users = await getUsers();
    setUsers(users);
  };

  const getBarcodes = async () => {
    barcodesHandler.setState([]);

    // setup queries for retrieving barcodes data
    const queryConstraints: QueryConstraint[] = [orderBy("timestamp", "desc")];

    // filter by user
    const selectedUserName =
      users.find((user) => user.uid === selectedUser)?.displayName ||
      user.displayName;
    if (selectedUser && selectedUserName) {
      queryConstraints.push(where("name", "==", selectedUserName));
    }

    // filter by time
    switch (selectedDateOption) {
      case DATE_OPTION.TODAY:
        const today = moment();
        const startOfToday = today.startOf("day").valueOf();
        const endOfToday = today.endOf("day").valueOf();
        queryConstraints.push(where("timestamp", ">=", startOfToday));
        queryConstraints.push(where("timestamp", "<=", endOfToday));
        break;

      case DATE_OPTION.YESTERDAY:
        const yesterday = moment().subtract(1, "day");
        const startOfYesterday = yesterday.startOf("day").valueOf();
        const endOfYesterday = yesterday.endOf("day").valueOf();
        queryConstraints.push(where("timestamp", ">=", startOfYesterday));
        queryConstraints.push(where("timestamp", "<=", endOfYesterday));
        break;

      case DATE_OPTION.A_DAY:
        if (!date) break;
        console.log(
          "🚀 ~ file: BarcodeList.component.tsx ~ line 95 ~ getBarcodes ~ date",
          date
        );
        const startOfDate = moment(date).startOf("day").valueOf();
        const endOfDate = moment(date).endOf("day").valueOf();
        queryConstraints.push(where("timestamp", ">=", startOfDate));
        queryConstraints.push(where("timestamp", "<=", endOfDate));
        break;

      case DATE_OPTION.RANGE:
        if (!dateRange[0] || !dateRange[1]) break;
        const startDate = dateRange[0].valueOf();
        const endDate = moment(dateRange[1]).endOf("day").valueOf();
        queryConstraints.push(where("timestamp", ">=", startDate));
        queryConstraints.push(where("timestamp", "<=", endDate));
        break;
      default:
        break;
    }

    // get data
    const barcodes: BarcodeData[] = await getBarcodesWith(queryConstraints);
    barcodesHandler.prepend(...barcodes);
  };

  const searchBarcode = async (values: { barcode: string }) => {
    // trim value and clean barcodes list
    const trimmedBarcode = values.barcode.trim();
    barcodesHandler.setState([]);

    // prepare queries
    const queryConstraints: QueryConstraint[] = [
      where("barcode", "==", trimmedBarcode),
    ];

    const barcodes: BarcodeData[] = await getBarcodesWith(queryConstraints);
    barcodesHandler.prepend(...barcodes);
  };

  useEffect(() => {
    getFilters();
  }, []);

  useEffect(() => {
    // do not waste resources interating when date range isn't selected
    if (
      selectedDateOption === DATE_OPTION.RANGE &&
      (!dateRange[0] || !dateRange[1])
    )
      return;

    getBarcodes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedUser, selectedDateOption, date, dateRange]);

  return (
    <Group direction="column">
      {showFilter ? (
        <motion.div
          style={{ width: "100%", display: showFilter ? "block" : "none" }}
          animate={showFilter ? "open" : "close"}
          variants={{
            open: (height = 1000) => ({
              clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
              transition: {
                type: "spring",
                stiffness: 16,
                restDelta: 2,
              },
            }),
            closed: {
              clipPath: "circle(30px at 40px 40px)",
              transition: {
                delay: 0.5,
                type: "spring",
                stiffness: 400,
                damping: 40,
              },
            },
          }}
        >
          <Grid>
            <Grid.Col xs={12} md={6} lg={4} xl={3}>
              <Select
                label="Users"
                placeholder="Pick User"
                itemComponent={MySelectItem}
                sx={{ width: "100%" }}
                data={users.map((user) => ({
                  value: user.uid,
                  image: user.photoURL,
                  label: user.displayName,
                  description: user.email,
                }))}
                onChange={setSelectedUser}
                nothingFound="No Users Found"
                filter={(value, item) =>
                  item?.label
                    ?.toLowerCase()
                    .includes(value.toLowerCase().trim()) ||
                  item?.description
                    ?.toLowerCase()
                    .includes(value.toLowerCase().trim())
                }
              />
            </Grid.Col>

            <Grid.Col xs={12} md={6} lg={4} xl={3}>
              <Select
                label="Date Option"
                placeholder="Pick Date Option"
                data={Object.values(DATE_OPTION).map((option) => ({
                  value: option,
                  label: option,
                }))}
                sx={{ width: "100%" }}
                onChange={setSelectedDateOption}
                nothingFound="No Optinos Found"
                filter={(value, item) =>
                  item?.label
                    ?.toLowerCase()
                    .includes(value.toLowerCase().trim()) ||
                  item?.description
                    ?.toLowerCase()
                    .includes(value.toLowerCase().trim())
                }
              />
            </Grid.Col>

            {selectedDateOption === DATE_OPTION.RANGE ? (
              <Grid.Col xs={12} md={6} lg={4} xl={3}>
                <DateRangePicker
                  sx={{ width: "100%" }}
                  label="Range"
                  placeholder="Pick dates range"
                  value={dateRange}
                  onChange={setDateRange}
                />
              </Grid.Col>
            ) : null}

            {selectedDateOption === DATE_OPTION.A_DAY ? (
              <Grid.Col xs={12} md={6} lg={4} xl={3}>
                <DatePicker
                  sx={{ width: "100%" }}
                  label="Date"
                  placeholder="Pick a date"
                  value={date}
                  onChange={setDate}
                />
              </Grid.Col>
            ) : null}

            <Grid.Col xs={12} md={6} lg={4} xl={3}>
              <Box
                component="form"
                onSubmit={searchForm.onSubmit(searchBarcode)}
                sx={{ width: "100%" }}
              >
                <TextInput
                  label="Search"
                  placeholder="Enter Barcode Number"
                  sx={{ width: "100%" }}
                  rightSection={
                    <ActionIcon type="submit">
                      <MagnifyingGlassIcon />
                    </ActionIcon>
                  }
                  {...searchForm.getInputProps("barcode")}
                />
              </Box>
            </Grid.Col>
          </Grid>
        </motion.div>
      ) : null}

      <Group
        direction="column"
        sx={{
          padding: "5",
          paddingBottom: "24",
          width: "100%",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Text>Results: {barcodes.length}</Text>
          <Group>
            <Tooltip label="Filter">
              <ActionIcon
                variant={showFilter ? "filled" : "light"}
                size="lg"
                onClick={() => toggleFilter()}
              >
                <MixerHorizontalIcon />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Refresh">
              <ActionIcon variant="light" size="lg" onClick={getBarcodes}>
                <ReloadIcon />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Box>
        <Divider sx={{ width: "100%" }} />
        {barcodes.length ? (
          barcodes.map(({ name, barcode, timestamp }) => (
            <Group
              key={barcode}
              direction="column"
              spacing="xs"
              sx={{ width: "100%" }}
            >
              <Text size="sm">{name}</Text>
              <Text size="xl" weight="bold">
                {barcode}
              </Text>
              <Text size="xs">
                {moment(timestamp).format(TIME_FORMAT.VERBOSE)}
              </Text>
              <Divider sx={{ width: "100%" }} />
            </Group>
          ))
        ) : (
          <Title order={2}>No Records</Title>
        )}
      </Group>

      <ScanButton barcodesAppend={barcodesHandler.append} />
    </Group>
  );
};

export default BarcodeList;
