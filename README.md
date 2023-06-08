# ft_transcendence</br>
Backend for project ft_transcendence written with TypeScript framework NestJS.</br>

This API is used to manage users, friendships, blocks, and status updates.</br>

## Authentication</br>
### POST /auth/42</br>

This endpoint is used to authenticate a user via 42 OAuth2 authentication. Upon successful authentication, a JWT token is generated and returned in the response header. This token is then used to authenticate all subsequent requests.

Request: None.</br>
Response:</br>
    Status Code: 200</br>
    Header: Authorization: Bearer <JWT Token></br>


## Users</br>
### GET /user/all</br>

This endpoint is used to retrieve a list of all users.</br>

Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
Response:</br>
    Status Code: 200</br>
    Body: All users.</br>

### GET /user/find</br>

This endpoint is used to retrieve a specific user by their login.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    body:     
    {</br>
        "login": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>
    Body: User.</br>

### DELETE /user/delete</br>
This endpoint is used to delete a user by their login.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    body:     
    {</br>
        "login": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>
    Body: User.</br>

## friendship</br>

### POST /user/friendship</br>
This endpoint is used to create a friendship between two users.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    Body:</br>
    {</br>
        "loginA": string,</br>
        "loginB": string,</br>
    }</br>
Response:</br>  
    Status Code: 200</br>

### GET /user/friends</br>
This endpoint is used to retrieve a list of a user's friends.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    body:     
    {</br>
        "login": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>
    Body: Friendship.</br>

### DELETE /user/friendship</br>
This endpoint is used to remove a user friendship from other user.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    Body:</br>
    {</br>
        "loginA": string,</br>
        "loginB": string,</br>
    }</br>

## Blocks</br>
### POST /user/block</br>
This endpoint is used to block a user.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    Body:</br>
    {</br>
        "login": string,</br>
        "blockedLogin": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>   

### DELETE /user/block</br>
This endpoint is used to unblock a user.</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    Body:</br>
    {</br>
        "login": string,</br>
        "blockedLogin": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>

### GET /user/blocks
This endpoint is used to retrieve a list of a user's blocked users.
Request:</br>
    Header: Authorization: Bearer <JWT Token></br>
    body:     
    {</br>
        "login": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>
    Body: List of blocked users.</br>

## Status
### GET /user/status</br>
This endpoint is used to retrieve a status of user (login).</br>
Request:</br>
    Header: Authorization: Bearer <JWT Token>.</br>
    body:     
    {</br>
        "login": string,</br>
    }</br>
Response:</br>
    Status Code: 200</br>
    Body: status of user.</br>


