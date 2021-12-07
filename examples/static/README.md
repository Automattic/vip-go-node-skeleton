# Serve static files

This example is a modified version of the skeleton code,
designed to demonstrate serving static files.

This uses [Express](https://expressjs.com/) to handle most of the logic, making
it very simple to just drop HTML, JS, CSS, and supporting files
into one or more directories and then serve them, provided they exist.

Note there are additional dependencies in the package.json
- Express

## Caveats
- While the files are stored in the `public` subfolder (e.g., `/public/assets/hello.jpg`), this example serves those files at the root of the server. Make sure that your frontend uses the correct path (e.g., `/assets/hello.jpg`).

## To use:
- place in the root directory of your repository
- drop your static files into src/public
- `npm install`
- `npm start`
