import { swatch, fileIcon, logoShirt, stylishShirt, posterShirt } from "./assets";

export const EditorTabs = [
  // {
  //   name: "textPicker",
  //   icon: swatch,
  // },
  {
    name: "filepicker",
    icon: fileIcon,
  },
];

export const DecalTypes = {
  logo: {
    stateProperty: "selectedLogoDecal",
    filterTab: "logoShirt",
  },
  poster: {
    stateProperty: "selectedPosterDecal",
    filterTab: "posterShirt",
  },
  text: {
    stateProperty: "customText",
    filterTab: "customText",
  }
};
