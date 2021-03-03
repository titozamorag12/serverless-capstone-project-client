// execution: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = "h723briz3e";
export const apiEndpoint = `https://${apiId}.execute-api.us-east-2.amazonaws.com/dev`;

export const authConfig = {
  // execution: Create an Auth0 application and copy values from it into this map
  domain: "gzamora-udacity-capstone.us.auth0.com", // Auth0 domain
  clientId: "d6WE3Ms1NjOxWsu5d34o0sBksh9tRgPI", // Auth0 client id
  callbackUrl: "http://localhost:3000/callback",
};
