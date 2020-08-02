import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

import { PhotoItem } from '../models/PhotoItem';

export class PhotosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly photosTable = process.env.PHOTOS_TABLE) {
  }

async getPhotosPerUser(userId: string) {
    const result = await this.docClient.query({
      TableName: this.photosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
  
    return result.Items
  }

  async storePhoto(photo: PhotoItem): Promise<PhotoItem> {
    await this.docClient.put({
      TableName: this.photosTable,
      Item: photo
    }).promise()

    return photo
  }
}
/*
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
} */
