/** @type {import('tailwindcss').Config} */
import aspectRatio from '@tailwindcss/aspect-ratio';
import forms from '@tailwindcss/forms';
import lineClamp from '@tailwindcss/line-clamp';
import typography from '@tailwindcss/typography';

const config = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './.storybook/**/*.{js,jsx,ts,tsx,mdx}',
    './*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    forms,
    typography,
    lineClamp,
    aspectRatio
  ],
};

export default config;
