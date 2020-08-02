import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodosAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { getUploadUrl, getImageUrl } from '../s3/s3service'

const groupAccess = new TodosAccess()

export async function getAllTodos(jwtToken: string): Promise<TodoItem[]> {
  const userId = parseUserId(jwtToken)
  return groupAccess.getAllTodosPerUserId(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await groupAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false    
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  jwtToken: string,
  todoId: string
): Promise<TodoItem> {

  const userId = parseUserId(jwtToken)

  //In case that the attachmentUrl is transported, this value will be updated with a separate call
  if(typeof updateTodoRequest.attachmentUrl !== 'undefined'){
    await groupAccess.updateTodoWithAttachmentUrl(userId, todoId, updateTodoRequest.attachmentUrl)
  }

  return await groupAccess.updateTodo({
    todoId: todoId,
    userId: userId,
    createdAt: undefined,
    name: updateTodoRequest.name,
    dueDate: updateTodoRequest.dueDate,
    done: updateTodoRequest.done
  })
}

export async function deleteTodo(todoId: string, jwtToken: string) {
  const userId = parseUserId(jwtToken)

  return await groupAccess.deleteTodo( todoId, userId)
}


export async function generateUploadUrl(jwtToken: string, todoId: string) {
  const userId = parseUserId(jwtToken)
  const generatedUrl = await getUploadUrl(todoId)
  const imageUrl = await getImageUrl(todoId)

  //Store pre-signed image-url in the todo-table
  await groupAccess.updateTodoWithAttachmentUrl(userId, todoId, imageUrl)

  return generatedUrl 
}
