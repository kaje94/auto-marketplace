import React from "react";
import type { Preview } from "@storybook/react";
import { standardFont } from "../src/app/fonts";
import { ReactQueryProvider } from "../src/providers/ReactQueryProvider";
import "../src/app/globals.css";

const preview: Preview = {
    parameters: {
        actions: { argTypesRegex: "^on[A-Z].*" },
        controls: {
            matchers: {
                color: /(background|color)$/i,
                date: /Date$/i,
            },
        },
    },
    decorators: [(Story) => <div className={standardFont.className}>{Story()}</div>, (Story) => <ReactQueryProvider>{Story()}</ReactQueryProvider>],
};

export default preview;
