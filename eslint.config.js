import { configs, plugins } from "eslint-config-airbnb-extended";
import eslintConfigPrettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // ignores
  {
    ignores: ["node_modules/**", "dist/**", "build/**", "vite-env.d.ts"],
  },

  // airbnb-extended plugins
  plugins.stylistic,
  plugins.importX,
  plugins.typescriptEslint,

  // Main configurations from airbnb-extended
  ...configs.base.all,

  // Project-specific language options
  {
    files: ["src/**/*.ts", "src/**/*.tsx"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // Custom Rules Code Quality
  {
    files: ["src/**/*.ts", "src/*.ts", "src/**/*.tsx"],
    rules: {
      "max-lines-per-function": [
        "error",
        { max: 60, skipBlankLines: true, skipComments: true },
      ],
      complexity: ["error", { max: 400 }],

      "no-magic-numbers": "error",
      "no-console": "warn",
      "no-debugger": "error",
      "no-alert": "error",

      // --- TypeScript ---
      "@typescript-eslint/no-magic-numbers": [
        "error",
        {
          ignore: [0, 1, -1],
          ignoreArrayIndexes: true,
          ignoreDefaultValues: true,
          detectObjects: false,
        },
      ],
      "@typescript-eslint/no-explicit-any": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],

      // --- Imports & Style ---

      "import-x/prefer-default-export": "off",
      "import-x/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
    },
  },

  // Config file overrides

  {
    files: ["*.config.*", "eslint.config.*", "vite.config.*"],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
    rules: {
      "no-magic-numbers": "off",
      "@typescript-eslint/no-magic-numbers": "off",
    },
  },

  // Prettier integration (must be last)
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      ...eslintConfigPrettier.rules,
      "prettier/prettier": "error",
    },
  },
);
