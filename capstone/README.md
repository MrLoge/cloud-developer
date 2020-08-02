# Serverless Capstone project

This capstone projects extends the serverless TODO application from the serverless milestone with some interesting picture features. 

# Functionality of the application

This application will allow creating/removing/updating/fetching TODO items. Each TODO item can optionally have an attachment image. Each user only has access to TODO items that he/she has created.
The user can either upload a local file or use a keyword search to get recommended some appropriate pictures that he can use as an attachment for a specific TODO-entry.


# New Functions implemented

Beside the TODO functionality of creating, updating and deleting TODO items, a user can search for pictures from the Unsplash-Website to attach to a specific TODO. 

The following endpoints have been created for this (on top of the normal TODO operations):

## SearchPhotos
path: photos/{keyword}

This handler returns 10 photos for the specified keyword from the page Unsplash.com which is accessed through the handler via an API


## StorePhoto
path: photos

This handler bookmarks a photo found in the search-handler from Unsplash.com 

## GetPhotos

path: photos

This handler returns all photos bookmarked for the logged-in user. This can be used for the UI to show a list of Favorite-Photos which can then be attached to a specific ToDo.


##UpdateTodo
path: todos/{todoId}

This handler was updated to accept a attachmentUrl. This allows a workflow to search for nice photos from Unsplash.com via the SearchPhotos, bookmark some and then attach one of them to a specific Todo.


# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```
The capstone project has been deployed to the following URL: 
https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev

endpoints:
  GET - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/todos
  POST - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/todos
  PATCH - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/todos/{todoId}
  DELETE - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/todos/{todoId}
  POST - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/todos/{todoId}/attachment
  GET - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/photos/{keyword}
  POST - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/photos
  GET - https://fuifj4s730.execute-api.eu-central-1.amazonaws.com/dev/photos


## Frontend

The client-config has been adjusted to carry the correct api-credentials `client/src/config.ts`. Run the following commands:

```
cd client
npm install
npm run start
```
