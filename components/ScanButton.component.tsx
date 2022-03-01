import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React from "react";
import { useAuth } from "../providers/useAuth";
import dynamic from "next/dynamic";
import { BarcodeData } from "../interfaces/Barcode.interface";
import moment from "moment";
import { createNewBarcode } from "../firebase/firestore";
import useSound from "use-sound";
import { Capacitor } from "@capacitor/core";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

// audios

const BarcodeScannerComponent = dynamic(import("react-qr-barcode-scanner"), {
  ssr: false,
});

const ScanButton = () => {
  const user = useAuth();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [playSuccess] = useSound("success.wav");
  const [playError] = useSound("error.wav");

  // guard
  if (!user) return null;

  const scanNatively = async () => {
    // ask for camera permission
    const status = await BarcodeScanner.checkPermission({ force: true });
    if (!status.granted) {
      toast({
        title: "Failed Permission",
        description: "Access to Camera Denied",
        status: "error",
        isClosable: true,
      });
    }

    // scan barcode
    await BarcodeScanner.hideBackground();
    const result = await BarcodeScanner.startScan();

    // guard
    if (!result.hasContent || !result.content) return;

    // set to Firestore
    const barcodeData: BarcodeData = {
      barcode: result.content,
      name: user.displayName || user.email || user.uid,
      timestamp: moment().valueOf(),
    };
    onClose();

    try {
      await createNewBarcode(barcodeData);
      toast({
        title: "Scanned!",
        description: `${barcodeData.barcode} by ${barcodeData.name}`,
        status: "success",
        isClosable: true,
      });
      playSuccess();
    } catch (e: any) {
      toast({
        title: "Hold on!",
        description: e.message,
        status: "error",
        isClosable: true,
      });
      playError();
    }
  };

  const ModalBodyInnerContent = () => {
    if (Capacitor.isNativePlatform()) {
      scanNatively();
      return null;
    } else if (typeof window !== "undefined") {
      return (
        <BarcodeScannerComponent
          width="100%"
          onUpdate={async (err, result) => {
            if (result) {
              const barcodeData: BarcodeData = {
                barcode: result.getText(),
                name: user.displayName || user.email || user.uid,
                timestamp: moment().valueOf(),
              };
              onClose();

              try {
                await createNewBarcode(barcodeData);
                toast({
                  title: "Scanned!",
                  description: `${barcodeData.barcode} by ${barcodeData.name}`,
                  status: "success",
                  isClosable: true,
                });
                playSuccess();
              } catch (e: any) {
                toast({
                  title: "Hold on!",
                  description: e.message,
                  status: "error",
                  isClosable: true,
                });
                playError();
              }
            }
          }}
        />
      );
    }
    return (
      <Text>Unexpected error occured, please try to reload the page.</Text>
    );
  };

  return (
    <>
      <Box
        as={Button}
        variant="solid"
        colorScheme="blue"
        position="fixed"
        width="full"
        maxWidth={300}
        bottom={0}
        left="50%"
        transform="translateX(-50%)"
        marginBottom={10}
        onClick={onOpen}
      >
        Scan
      </Box>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Scanning...</ModalHeader>
          <ModalBody padding={0} alignItems="center">
            <ModalBodyInnerContent />
          </ModalBody>
          <ModalFooter>
            <Button variant="unstyled" onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ScanButton;
