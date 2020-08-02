import * as AWS  from 'aws-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const AWSXRay = require('aws-xray-sdk');
const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodosAccess {

  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndex = process.env.INDEX_NAME) {
  }

  //This method will return all Todos for a specific userId
  async getAllTodosPerUserId(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos')

    const result = await this.docClient
    .query({
      TableName: this.todosTable,
      IndexName: this.todosIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    })
    .promise()

    const items = result.Items
    return items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async updateTodo(todo: TodoItem): Promise<TodoItem> {
      await this.docClient.update({
        TableName: this.todosTable,
        Key:{
            "userId": todo.userId,
            "todoId": todo.todoId
        },
        UpdateExpression: "SET #todo_name = :todo_name, dueDate=:dueDate, done=:done",
        ExpressionAttributeValues:{
            ":todo_name": todo.name,
            ":dueDate": todo.dueDate,
            ":done": todo.done
        },
        ExpressionAttributeNames:{
            "#todo_name": "name"
        },    
        ReturnValues:"UPDATED_NEW"
      }).promise()

      return todo;
  }

  async updateTodoWithAttachmentUrl(userId: string, todoId: string, attachmentUrl: string) {
    await this.docClient.update({
        TableName: this.todosTable,
        Key:{
            "userId": userId,
            "todoId": todoId
        },
        UpdateExpression: "SET attachmentUrl = :attachmentUrl",
        ExpressionAttributeValues:{
            ":attachmentUrl": attachmentUrl
        }
      }).promise()
  }

  async deleteTodo(todoId: string, userId: string) {
      await this.docClient.delete({
        TableName: this.todosTable,
        Key: {
            todoId: todoId,
            userId: userId
        }
      }).promise()
  }
}

/*
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient()({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
*/