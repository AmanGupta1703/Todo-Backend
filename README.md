# Todo App Backend

- This is the backend for a todo app. It is built using Node.js, Express and MongoDB.

## Features

- Create a new todo
- Get all todos
- Get a todo by id
- Update a todo
- Delete a todo
- Complete Todo Stats

## Technologies

- Node.js
- Express
- MongoDB

## Installation

1. Clone the repository

```bash
git clone https://github.com/AmanGupta1703/Todo-Backend.git
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables

```bash
PORT=3000
MONGODB_URI=your_mongo_uri
```

4. Start the server

```bash
npm start
```

## API Endpoints

- GET `/api/v1/todo` - Get all todos
- POST `/api/v1/todo` - Create a new todo
- GET `/api/v1/todo/:id` - Get a todo by id
- PATCH `/api/v1/todo/:id` - Update a todo
- DELETE `/api/v1/todo/:id` - Delete a todo
- GET `/api/v1/todo/stats` - Get todos stats
