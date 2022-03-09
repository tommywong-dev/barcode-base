import "../styles/globals.css";
import type { AppProps } from "next/app";
import React from "react";
import { AuthProvider } from "../providers/useAuth";
import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Barcode Base</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </>
  );
}

export default MyApp;
