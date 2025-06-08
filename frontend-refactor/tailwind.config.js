/ ** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,mdx}',
    './stories/**/*.{js,jsx,ts,tsx,mdx}',
    './*.{js,jsx,ts,tsx,mdx}'
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/line-clamp')
  ],
};
