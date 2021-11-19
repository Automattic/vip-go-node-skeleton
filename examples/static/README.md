# Serve static files

This example is a modified version of the skeleton code,
designed to demonstrate serving static files.

This uses Express to handle most of the logic, making
it very simple to just drop HTML, JS, CSS, and supporting files
into one or more directories and then serve them, provided they exist.

Note there are additional dependencies in the package.json
- Express
- Path

## Caveats
- The static files will be served at the path declared in the code, so any links in the HTML should be relative links

## To use:
- place in the root directory of your repository
- drop your static files into src/public
- npm install
- npm test
- build, and deploy