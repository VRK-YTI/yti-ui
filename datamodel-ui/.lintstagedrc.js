module.exports = {
  // next lint (eslint)
  '**/*.{js,jsx,ts,tsx}': (filenames) => [
    `next lint --file ${filenames.join(' --file ')}`,
  ],

  // prettier
  '**/*.{ts,tsx,js,jsx,md,json,scss,css}': `prettier --check`,
};
