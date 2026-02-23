module.exports = {
  // eslint
  'src/**/*.{js,jsx,ts,tsx}': (filenames) => [`eslint ${filenames.join(' ')}`],

  // prettier
  '**/*.{ts,tsx,js,jsx,md,json,scss,css}': `prettier --check`,
};
