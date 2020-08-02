import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('get')

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { searchPhotos } from '../../businessLogic/photos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Search Photos by a keyword
  logger.info("Processing searchPhotos-Handler", event)

  const keyword = event.pathParameters.keyword

  const photoResults = await searchPhotos(keyword)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      items: photoResults
    })
  }
}
