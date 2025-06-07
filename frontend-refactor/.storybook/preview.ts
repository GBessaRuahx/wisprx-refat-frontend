import type { Preview } from "@storybook/react";
import React from "react";
import "../src/styles/globals.css";
import RootApp from "../src/app/App.jsx";

const preview: Preview = {
  decorators: [
    (Story) => <RootApp Component={Story} pageProps={{}} />,
  ],
};

export default preview;
