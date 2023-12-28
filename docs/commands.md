# Commands you need to run

- `npm run dev` Starts the development server
- `npm run build` Builds the code
- `npm run lint` Lints the code
- `npm run format` Formats the code
- `npm run i18n` Handles many i18n related things automatically
- `npm test` Runs tests
- `npm start` Starts the production server from previous build

## Before pushing commits to GitHub

There is CI in GitHub. If you want to ensure that your commit will pass checks
on the first try, run the following commands before pushing. The order is not
important but if you have to make changes to your code then consider running
the commands again.

- `npm run i18n`
- `npm run lint`
- `npm run format`
- `npm run build`
- `npm test`
