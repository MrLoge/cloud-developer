import 'source-map-support/register'
import { createLogger } from '../../utils/logger'

import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { StorePhotoRequest } from '../../requests/StorePhotoRequest'
import { storePhoto } from '../../businessLogic/photos'

const logger = createLogger('storePhoto')

// This handler bookmarks a photo found in the search-photo handler. 
export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing StorePhoto-Handler", event)
  
  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  
  const newPhoto: StorePhotoRequest = JSON.parse(event.body)

  logger.info("User has requested to store the following Photo: ", newPhoto)

  const newItem = await storePhoto(jwtToken, newPhoto)

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      newItem
    })
  }
}
