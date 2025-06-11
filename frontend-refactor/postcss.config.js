const config = {
  plugins: {
    "@tailwindcss/postcss":{},
    "autoprefixer": {},
    "postcss-nested": {},
    "postcss-custom-properties": {
      preserve: false,
      importFrom: "./src/styles/variables.css",
    },
  },
};

export default config;
