import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends(
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier"
  ),
  {
    rules: {
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          pathGroups: [
            {
              pattern: "@/app/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/features/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/components/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/lib/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/assets/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/hooks/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/providers/**",
              group: "internal",
              position: "after",
            },
            {
              pattern: "@/types/**",
              group: "internal",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          "newlines-between": "always",
        },
      ],
    },
  },
];

export default eslintConfig;
