import 'source-map-support/register'
import { createLogger } from '../../utils/logger'
const logger = createLogger('upload')

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import { generateUploadUrl } from '../../businessLogic/todos'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  logger.info("Processing generateUploadUrl-Handler", event)
  const todoId = event.pathParameters.todoId

  logger.info("User has requested to upload an url for the following todoId: ", todoId)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]

  // Return a presigned URL to upload a file for a TODO item with the provided id
  const uploadUrl = await generateUploadUrl(jwtToken, todoId)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
}