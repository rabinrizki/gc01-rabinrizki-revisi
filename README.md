[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=15319091&assignment_repo_type=AssignmentRepo)

# P2-Challenge-1 (Server Side)

> Tuliskan API Docs kamu di sini

# LINK DEPLOY SERVER : 

- https://gc1server.cbasic.my.id/

# Product API Documentation

## Endpoints :

### List of available endpoints:

-   POST /add/product
-   GET /products
-   GET /products/:id
-   PUT /products/:id
-   DELETE /products/:id
-   POST /add/category
-   GET /categories
-   GET /categories/id
-   PUT /categories/:id
-   POST /add/user
-   POST /login
-   GET /pub/products
-   GET /pub/products/:id

# link: server.cbasic.my.id

# POST /add/product

### Description:

-   Create product

### headers:

```js
{
    "access_token": "access_token"
}
```

### body:

```json

{
      "name": "string",
      "description": "string",
      "price": integer,
      "stock": integer,
      "imgUrl": "string",
      "categoryId": integer,
      "authorId": integer
}

```

### Response (201 - Created)

```json
{       
      "id": integer,
      "name": "string",
      "description": "string",
      "price": integer,
      "stock": integer,
      "imgUrl": "string",
      "categoryId": integer,
      "authorId": integer
}
```

### Response (400 - Validation Error)

```json
{
    "message": "name cannot be null"
}
OR
{
    "message": "description cannot be null"
}
OR
{
    "message": "price cannot be null"
}
OR
{
    "message": "categoryId cannot be null"
}
OR
{
    "message": "authorId cannot be null"
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# GET /products

## Description:

-   Get all product

### headers:

```js
{
    "access_token": "access_token"
}
```

### Response (200 - OK)

```json
{
  "page": integer,
  "data": [
    {
      "id": integer,
      "name": "string",
      "description": "string",
      "price": integer,
      "stock": integer,
      "imgUrl": "string",
      "categoryId": integer,
      "authorId": integer,
      "createdAt": date,
      "updatedAt": date,
      "User": {
        "id": integer,
        "username": "string",
        "email": "string",
        "password": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": date,
        "updatedAt": date
      }
    }
  ],
  "totalData": integer,
  "totalPage": integer,
  "dataPerPage": integer
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# GET /products/:id

### Description:

-   Get detail product by id

### headers:

```json
{
    "access_token": "access_token"
}
```

### Response (200 - OK )

```json
{
  "product": {
    "id": integer,
    "name": "string",
    "description": "string",
    "price": integer,
    "stock": integer,
    "imgUrl": "string",
    "categoryId": integer,
    "authorId": integer,
    "createdAt": date,
    "updatedAt": date
  }
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# PUT /products/:id

### Description:

-   Update product by id

### headers:

```json
{
    "access_token": "access_token"
}
```

### body:

```json
{
  "name": "string",
  "description": "string",
  "price": integer,
  "stock": integer,
  "imgUrl": "string",
  "categoryId": integer,
  "authorId": integer
}
```

### Response (200 - OK)

```json
{
  "name": "string",
  "description": "string",
  "price": integer,
  "stock": integer,
  "imgUrl": "string",
  "categoryId": integer,
  "authorId": integer
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (404 - Not Found)

```json
{
    "message": "Data not found"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# DELETE /products/:id

### Description:

-   Delete product By Id

### headers:

```json
{
    "access_token": "access_token"
}
```

### Response (200 - OK)

```json
{
    "message": "product with id 1 deleted"
}
```

### Response (404 - Not Found)

```json
{
    "message": "Data not found"
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```


# POST /add/category

### Description:

-   Create category

### headers:

```json
{
    "access_token": "access_token"
}
```

### body:

```json
{
    "name": "string",
}
```

### Response (201 - Created)

```json
{
    "id": integer,
    "name": "string"
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (400 - Validation Error)

```json
{
    "message": "name cannot be null"
}
```

# GET /categories

## Description:

-   Get all category

### headers:

```json
{
    "access_token": "access_token"
}
```

### Response (200 - OK)

```json
{
  "category": [
    {
      "id": integer,
      "name": "string",
      "createdAt": date,
      "updatedAt": date
    },
    {
      "id": integer,
      "name": "string",
      "createdAt": date,
      "updatedAt": date
    },
  ]
}
```

### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# GET /categories/:id

### Description:

-   Get detail category by id

### headers:

```json
{
    "access_token": "access_token"
}
```

### Response (200 - OK )

```json
{
  "category": {
    "id": integer,
    "name": "string",
    "createdAt": date,
    "updatedAt": date
  }
}
```
### Response (401 - Unauthorized)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# PUT /categories/:id

### Description:

-   Update category by id

### headers:

```json
{
  "access_token": "access_token"
}
```

### body:

```json
{
  "name": "category5 update"
}
```

### Response (200 - OK)

```json
{
  "message": "3 success update"
}
```

### Response (404 - Not Found)

```json
{
    "message": "not-found"
}
```

### Response (401 - Unauthenticate)

```json
{
    "message": "Unauthenticate"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# POST /add/user

### Description:

-   Create user

### headers:

```json
{
  "access_token": "access_token"
},
{
  "adminonly"
}
```

### body:

```json
{
    "username" : "string",
    "email": "string",
    "password": "string",
    "phoneNumber": "string",
    "address": "string"
}
```

### Response (201 - Created)

```json
{
    "id": integer,
    "username": "string",
    "email": "string",
    "role": "string",
    "phoneNumber": "string",
    "address": "string"
}
```

### Response (400 - Validation Error)

```json
{
  "message": "email cannot be null"
}
OR
{
  "message": "password cannot be null"
}
OR
{
  "message": "phoneNumber cannot be null"
}
OR
{
  "message": "address cannot be null"
}
```

### Response (500 - Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# POST /login

### Description:

-   Login

### body:

```json
{
  "email": "string",
  "password": "string"
}
```

### Response (200 - OK)

```json
{
  "access_token": "access_token",
  "authorId": 1
}
```

### Response (400 - Bad Request)

```json
{
  "message": "Email or password is required"
}
```

### Response (401 - Unauthorized)

```json
{
  "message": "Your email or password are wrong"
}
```

### Response (500 - Internal Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# GET /pub/products

## Description:

-   Get all public product

### Response (200 - OK)

```json
{
  {
  "page": integer,
  "data": [
    {
      "id": integer,
      "name": "string",
      "description": "string",
      "price": integer,
      "stock": integer,
      "imgUrl": "string",
      "categoryId": integer,
      "authorId": integer,
      "createdAt": date,
      "updatedAt": date,
      "User": {
        "id": integer,
        "username": "string",
        "email": "string",
        "password": "string",
        "role": "string",
        "phoneNumber": "string",
        "address": "string",
        "createdAt": date,
        "updatedAt": date
      }
    },
  ],
  "totalData": integer,
  "totalPage": integer,
  "dataPerPage": integer
}
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

# GET /pub/products/:id

### Description:

-   Get detail public product by id

### Response (200 - OK )

```json
{
  "product": {
    "id": integer,
    "name": "string",
    "description": "string",
    "price": integer,
    "stock": integer,
    "imgUrl": "string",
    "categoryId": integer,
    "authorId": integer,
    "createdAt": date,
    "updatedAt": date
  }
}
```

### Response (404 - Not Found)

```json
{
    "message": "Data not found"
}
```

### Response (500 - Server Error)

```json
{
    "message": "Internal Server Error"
}
```

