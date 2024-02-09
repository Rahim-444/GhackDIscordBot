# Discord Analytics Bot and Server Monitor

This project is a Discord bot and server monitor that provides analytics related to server activity, online members, and voice chat usage.

## Features

- Post a meeting and check how many users are in the meet after a few minutes.
- Get the number of online members in the server and categorize them based on their roles.
- Retrieve the active users in each voice chat and store the information in the database.

## Technologies Used

- **Node.js**
- **Express.js**
- **Discord.js**
- **MongoDB**
- **dotenv**
- **child_process**

## Getting Started

1. Fork and Clone the repository:

```bash
git clone https://github.com/your-username/GhackDIscordBott.git
cd GhackDIscordBot
```

2. Set up your environment variables file:
   Create a .env file and add the following:

```bash
TOKEN=your-discord-bot-token
MONGO_URI=your-mongodb-uri
DISCORD_COMMAND=your-discord-shell-command
```

3. Install the dependecies:

```bash
bun install
```

4. Run the server

```bash
bun start
```
