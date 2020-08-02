// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'fuifj4s730'
export const apiEndpoint = `https://${apiId}.execute-api.eu-central-1.amazonaws.com/dev`

export const authConfig = {
  // Create an Auth0 application and copy values from it into this map
  domain: 'dev-vv0icvhc.eu.auth0.com',            // Auth0 domain
  clientId: 'jLYrLVXioSYEXAbNajNmlrvZUf45tUm6',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
