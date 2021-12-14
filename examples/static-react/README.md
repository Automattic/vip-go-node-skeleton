# Serve an existing React project in a static site

This example extends our simpler examples to demonstrate serving a React project.

You may have a React, Vue, or other project that is built with Node and has a package.json. 
We'll demonstrate here how you can manage and serve a built version of that project
as part of a simple Node static website.

The create-react-app client is in the client directory, the rest of this project is very similar to our simpler static examples.

The project builds and serves the client React app using Express

Note that within the client folder, the .gitignore file (supplied by create-react-app) prevents committing node_modules and the build directories to source control. When the project is deployed, those resources are created by the build command, and will be deployed in the web container.

Note there are additional dependencies in the package.json
- Express

## To use:
- modify the React app in client/
- `npm install`
- `npm run build`
- `npm start`
