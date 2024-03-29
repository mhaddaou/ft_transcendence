# :ping_pong: Project Overview

This project consists of creating user accounts, chatting in channels, and playing the game pong.

### :adult: User Account

- Use OAuth to Authenticate Users To The Website using their 42 Intra Account.
- Choose a unique username.
- Upload a profile icon (doesn't have a profile icon, a default one must be set).
- Two-factor authentication (eg. Google Authenticator or Text Message to their Phone).
- Add friends and see current status (Online, Offline, or In A Game).
- Stats (Wins, Losses, Ladder Level, Achievements) displayed on Profile.
- User's Match History (1 v 1 Games and Ladder - anyone who they are friends with can see this).

### :speaking_head: Chat

- Create Channels (Chat Rooms) that are either public, private, or protected by a Password.
- Send Direct Messages to Other Users.
- Be able to Block Users (No More Messages from a user you blocked).
- Invite other users to play a game of pong through the chat interface.
- Access other player's profiles through a chat interface.

### :raising_hand: Channel Owner

- The user who creates a new channel is automatically the channel owner until they leave.
- Channel owner sets a password required to access a channel, including changing or removing the password.
- Channel owner is the channel admin and can set other users as admins as well.
- Channel admin can kick, ban, and mute other users, but not other channel admins.

### :ping_pong: Game

- Users should be able to play a live pong game vs. another player directly on the website
- Matchmaking system - the user can join a queue until they get automatically matched with someone.
- Customisation Options (eg. Power-ups, Different Maps), however, the user should be able to select a default version of the game.
- The Pong Game must be responsive.

<br>
<br>

# :joystick: Use Cases

All the different things a user can do when they come to this website:

### :house_with_garden: Channel Owner
- Creates, Edits, and Deletes Channels

### :technologist: Admin
- Add, Edit, and Remove Passwords of Channels
- Ban, Mute and Remove Users of Channels
- Set Admins of The Channels

### :elf: User
- Create a Profile
- Update Profile Icon
- Change Username
- Enable or disable Two-Factor Authentication
- Add, Send Invites, Send Message, Accept Invities, Remove, Block, and Un-Block Friends

### :ping_pong: Game
- Play The Pong Game

### :speech_balloon: Chat
- Join and Leave Channels
- Send Messages in Chat within the Channel
- Send Invites to Other Users to play the Pong Game

<br>
<br>

# :package: Database Structure

The Database Structure for this project consists of the profile the user creates, the pong game stats, and the chat history. The reason for this database is to show how everything is connected in this project.

## :desktop_computer: Profile

#### User

- My Player ID
- My Username
- My Profile Icon
- My Status (Online or Offline or in-game)
- My 2FA (2-Way Authentication) Details

## :video_game: Game

#### Player

- My Level
- Number of Wins I've Had
- Number of Losses I've Had

#### Game History

- All game history IDs that I've been in
- All Game Modes that I've been in (Single or Duos or Groups) 
- The History of Winners in Games
- The History of Losers in Games
- The History of Winners Scores in Games
- The History of Losers Scores in Games
- When The History of Games were Created

## :astronaut: Chat

#### Message

- The Message ID
- The Content of My Messages
- When Those Messages were Created

#### Chat Room

- The Chatroom ID
- The Chat Name
- The Chat Channels
- Is Channel Public
- The Channels Password
- When The Channel was Created
- When The Channel was Updated

#### Membership

- The Membership ID
- My Role in that Channel
- Am I banned within a Channel
- Am I muted within a Channel

<br>
<br>

# :keyboard: Development

### :framed_picture: Frontend 
- Any TypeScript Framework can be chosen for this project (Vue.js, Express.js, Next.js, Angular, Svelte, etc.)

### :door: Backend 
- Nest.js

### :package: Database 
- PostgreSQL  

### :guard: Security 
- Passwords must be hashed, protected against SQL injections and server-side validation for forms and any user input

### :globe_with_meridians: Browser 
- Compatible with all Browsers

### :runner: Run Command 

```
docker-compose up --build
```
