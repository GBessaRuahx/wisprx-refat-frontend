import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  "stories": [
    "../src/{features,ui,shared,entities}/**/*.stories.@(js|jsx|ts|tsx|mdx)"
  ],
  "addons": [
    "@storybook/addon-onboarding",
    "@chromatic-com/storybook",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
    "@storybook/addon-vitest"
  ],
  "framework": {
    "name": "@storybook/nextjs",
    "options": {}
  }
};
export default config;