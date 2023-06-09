<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
# ft_transcendence
# API Documentation

## Authentication

### Login with 42 Intra

- **Endpoint**: `/auth/42`
- **Method**: GET
- **Description**: Initiates the login process with 42 Intra authentication.
- **Authentication Required**: No
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: N/A

### 42 Intra Callback

- **Endpoint**: `/auth/callback`
- **Method**: GET
- **Description**: Callback URL for 42 Intra authentication. Generates a JWT token and redirects the user.
- **Authentication Required**: Yes (42 Intra)
- **Response**:
  - **Status Code**: 302 (Redirect)
  - **Body**: N/A

### Generate New QR Code

- **Endpoint**: `/auth/QR`
- **Method**: GET
- **Description**: Generates a new QR code for user authentication.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `userDto` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: JSON object containing the generated QR code data

### Validate Authentication Code

- **Endpoint**: `/auth/2-FA`
- **Method**: POST
- **Description**: Validates the authentication code provided by the user.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `twoFA` (Object):
    - `login` (String, required): User login
    - `code` (String, required): Authentication code
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: JSON object containing the validation result Bool

## Chat

### Get Conversation between Two Users

- **Endpoint**: `/chat/findConversation`
- **Method**: GET
- **Description**: Retrieves the conversation between two users.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `getConv` (Object):
    - `loginA` (String, required): Login of the first user
    - `loginB` (String, required): Login of the second user
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `Message` objects representing the conversation
    ```typescript
    interface Message {
      MsgId: string;
      content: string;
      sendAt: string;
      fromUserA: boolean; // Indicates if the message is sent by user A (true) or user B (false)
      conversationId: string;
    }
    ```

### Get Conversations of User

- **Endpoint**: `/chat/conversations`
- **Method**: GET
- **Description**: Retrieves the conversations that a user belongs to.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `dto` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `Conversation` objects representing the user's conversations
    ```typescript
    interface Conversation {
      ConvId: string;
      userAId: string;
      loginA: string;
      userBId: string;
      loginB: string;
      createdAt: string;
    }
    ```

---

## Channel

### Get Conversation Channel

- **Endpoint**: `/chat/channel/message/all`
- **Method**: GET
- **Description**: Retrieves the conversation channel.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `chDto` (Object):
    - `channelName` (String, required): Name of the channel
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `MsgChannel` objects representing the channel conversation
    ```typescript
    interface MsgChannel {
      MsgChannelId: string;
      login: string;
      content: string;
      sendAt: string;
      channelId: string;
      channelName: string;
    }
    ```

### Get All Public Channels

- **Endpoint**: `/chat/channel/all`
- **Method**: GET
- **Description**: Retrieves all public channels.
- **Authentication Required**: Yes (JWT)
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `Channel` objects representing the public channels
    ```typescript
    interface Channel {
      ChannelId: string;
      isPrivate: boolean;
      channelName: string;
      createdAt: string;
      LoginOwner: string;
      ispassword: boolean;
      password: string;
    }
    ```

### Get Members of Channel

- **Endpoint**: `/chat/channel/members`
- **Method**: GET
- **Description**: Retrieves the members of a channel.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `chDto` (Object):
    - `channelName` (String, required): Name of the channel
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `MembershipChannel` objects representing the channel members
    ```typescript
    interface MembershipChannel {
      MembershipId: string;
      createdAt: string;
      isMute: boolean;
      timeMute: string;
      isBlacklist: boolean;
      isOwner: boolean;
      isAdmin: boolean;
      channel: Channel;
    }
    ```

## User

### Get All Users

- **Endpoint**: `/user/all`
- **Method**: GET
- **Description**: Retrieves all users.
- **Authentication Required**: Yes (JWT)
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `User` objects representing the users
    ```typescript
    interface User {
      UserId: string;
      login: string;
      username: string;
      email: string;
      avatar: string;
      enableTwoFa: boolean;
      twoFactorSecret?: string;
      acheivement: string[];
    }
    ```

### Get Current User

- **Endpoint**: `/user/me`
- **Method**: GET
- **Description**: Retrieves the current user based on their JWT token.
- **Authentication Required**: Yes (JWT)
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: `User` object representing the current user
    ```typescript
    interface User {
      UserId: string;
      login: string;
      username: string;
      email: string;
      avatar: string;
      enableTwoFa: boolean;
      twoFactorSecret?: string;
      acheivement: string[];
    }
    ```

### Get User by Login

- **Endpoint**: `/user/find`
- **Method**: GET
- **Description**: Retrieves a user by their login.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `findUser` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: `User` object representing the found user
    ```typescript
    interface User {
      UserId: string;
      login: string;
      username: string;
      email: string;
      avatar: string;
      enableTwoFa: boolean;
      twoFactorSecret?: string;
      acheivement: string[];
    }
    ```

### Get User Friends

- **Endpoint**: `/user/friends`
- **Method**: GET
- **Description**: Retrieves the friends of a user.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `findUser` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `User` objects representing the user's friends
    ```typescript
    interface User {
      UserId: string;
      login: string;
      username: string;
      email: string;
      avatar: string;
      enableTwoFa: boolean;
      twoFactorSecret?: string;
      acheivement: string[];
    }
    ```

### Get Blocked Users

- **Endpoint**: `/user/blocks`
- **Method**: GET
- **Description**: Retrieves the list of blocked users for a user.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `findUser` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: Array of `User` objects representing the blocked users
    ```typescript
    interface User {
      UserId: string;
      login: string;
      username: string;
      email: string;
      avatar: string;
      enableTwoFa: boolean;
      twoFactorSecret?: string;
      acheivement: string[];
    }
    ```
### Get User Status

- **Endpoint**: `/user/status`
- **Method**: GET
- **Description**: Retrieves the status of a user.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `findUser` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: `Status` object representing the user's status
    ```typescript
    interface Status {
      statusId: string;
      userId: string;
      isOnline: boolean;
      inGame: boolean;
      createdAt: Date;
      updatedAt: Date;
    }
    ```

### Get User Stats

- **Endpoint**: `/user/stats`
- **Method**: GET
- **Description**: Retrieves the stats of a user.
- **Authentication Required**: Yes (JWT)
- **Request Body**:
  - `findUser` (Object):
    - `login` (String, required): User login
- **Response**:
  - **Status Code**: 200 (Success)
  - **Body**: `Stats` object representing the user's stats
    ```typescript
    interface Stats {
      StatsId: string;
      userId: string;
      wins: number;
      losses: number;
      ladder: number;
    }
    ```
