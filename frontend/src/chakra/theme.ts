import { type ThemeConfig, extendTheme } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme(
  { config },
  {
    colors: {
      brand: {
        100: "#805AD5",
      },
    },
    styles: {
      global: () => ({
        body: {
          bg: "whiteAlpha.200", // use "black" with Polypane
        },
      }),
    },
  },
);

export default theme;
