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
        100: "#3D84F7",
      },
    },
    styles: {
      global: () => ({
        body: {
          bg: "whiteAlpha.200",
        },
      }),
    },
  },
);

export default theme;
