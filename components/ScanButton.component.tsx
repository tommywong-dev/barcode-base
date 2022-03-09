import { Box, Button, Modal, Text } from "@mantine/core";
import React from "react";
import { useAuth } from "../providers/useAuth";
import dynamic from "next/dynamic";
import { BarcodeData } from "../interfaces/Barcode.interface";
import moment from "moment";
import { createNewBarcode } from "../firebase/firestore";
import useSound from "use-sound";
import { useNotifications } from "@mantine/notifications";
import { useModals } from "@mantine/modals";

// audios

const BarcodeScannerComponent = dynamic(import("react-qr-barcode-scanner"), {
  ssr: false,
});

const ScanButton = () => {
  const user = useAuth();
  const notifcations = useNotifications();
  const modals = useModals();

  const [playSuccess] = useSound("success.wav");
  const [playError] = useSound("error.wav");

  const handleScan = () => {
    const id = modals.openModal({
      title: "Scanning",
      children: (
        <Box>
          <BarcodeScannerComponent
            width="100%"
            onUpdate={async (err, result) => {
              if (result) {
                const barcodeData: BarcodeData = {
                  barcode: result.getText(),
                  name: user.displayName || user.email || user.uid,
                  timestamp: moment().valueOf(),
                };
                modals.closeModal(id);

                try {
                  await createNewBarcode(barcodeData);
                  notifcations.showNotification({
                    title: "Scanned!",
                    message: `${barcodeData.barcode} by ${barcodeData.name}`,
                    color: "green",
                  });
                  playSuccess();
                } catch (e: any) {
                  notifcations.showNotification({
                    title: "Hold on!",
                    message: e.message,
                    color: "red",
                  });
                  playError();
                }
              }
            }}
          />
          <Button fullWidth onClick={() => modals.closeModal(id)}>
            Done
          </Button>
        </Box>
      ),
    });
  };

  return (
    <Box
      sx={{
        position: "fixed",
        width: "80%",
        bottom: 0,
        left: "50%",
        right: "50%",
        transform: "translateX(-50%)",
        marginBottom: 10,
      }}
    >
      <Button
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        fullWidth
        onClick={handleScan}
      >
        Scan
      </Button>
    </Box>
  );
};

export default ScanButton;
