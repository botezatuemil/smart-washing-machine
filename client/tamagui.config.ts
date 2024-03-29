import { createInterFont,  } from "@tamagui/font-inter";

import { createMedia } from "@tamagui/react-native-media-driver";

import { shorthands } from "@tamagui/shorthands";

import { themes, tokens } from "@tamagui/theme-base";

import {  createTamagui } from "tamagui";

import { createAnimations } from "@tamagui/animations-react-native";
const animations = createAnimations({
  bouncy: {
    type: "spring",

    damping: 10,

    mass: 0.9,

    stiffness: 100,
  },

  lazy: {
    type: "spring",

    damping: 20,

    stiffness: 60,
  },

  quick: {
    type: "spring",

    // damping: 20,

    mass: 0.05,

    stiffness: 250,
    
  },
  
});
const headingFont = createInterFont({
	size: {
		1: 12,
		2: 14,
		3: 15,
		// ...
	  },
	  lineHeight: {
		1: 17,
		2: 22,
		3: 25,
		// ...
	  },
	  weight: {
		1: "300",
		2: "600",
	  },
	  letterSpacing: {
		4: 0,
		8: -1,
	  },
	
	  // for native only, alternate family based on weight/style
	  face: {
		// pass in weights as keys
		700: { normal: "InterBold", italic: "InterBold-Italic" },
		800: { normal: "InterBold", italic: "InterBold-Italic" },
		900: { normal: "InterBold", italic: "InterBold-Italic" },
	  },
});



const bodyFont = createInterFont();
const config = createTamagui({
  animations,

  defaultTheme: "dark",

  shouldAddPrefersColorThemes: false,

  themeClassNameOnRoot: false,

  shorthands,

  fonts: {
    heading: headingFont,
    body: bodyFont,
  },

  themes,

  tokens,

  media: createMedia({
    xs: { maxWidth: 660 },

    sm: { maxWidth: 800 },

    md: { maxWidth: 1020 },

    lg: { maxWidth: 1280 },

    xl: { maxWidth: 1420 },

    xxl: { maxWidth: 1600 },

    gtXs: { minWidth: 660 + 1 },

    gtSm: { minWidth: 800 + 1 },

    gtMd: { minWidth: 1020 + 1 },

    gtLg: { minWidth: 1280 + 1 },

    short: { maxHeight: 820 },

    tall: { minHeight: 820 },

    hoverNone: { hover: "none" },

    pointerCoarse: { pointer: "coarse" },
  }),
});
export type AppConfig = typeof config;
declare module "tamagui" {
  // overrides TamaguiCustomConfig so your custom types

  // work everywhere you import `tamagui`

  interface TamaguiCustomConfig extends AppConfig {}
}
export default config;
