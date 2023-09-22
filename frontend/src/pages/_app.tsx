import theme from "@/chakra/theme";
import { client } from "@/graphql/apollo-client";
import { ApolloProvider } from "@apollo/client";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Toaster } from "react-hot-toast";

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <>
      <Head key="_app.tsx">
        <script
          async
          src="https://stats.hazadus.ru/script.js"
          data-website-id="8101efef-cafb-4338-9b58-e6907809f14f"
        ></script>
      </Head>
      <ApolloProvider client={client}>
        <SessionProvider session={session}>
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
            <Toaster />
          </ChakraProvider>
        </SessionProvider>
      </ApolloProvider>
    </>
  );
}

export default MyApp;
