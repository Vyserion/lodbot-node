# LodBot
A Discord bot for the Legion of Doom, build in NodeJS.

## Configuration
LodBot required set up of a .env file, containing the following keys:

- LOG_LEVEL: The logging level of the bot. Will not change any output to the discord server, however will change the internal logging which is useful for debugging issues.
- BOT_KEY: The Discord Client key of the bot. Can be found within your discord application settings.
- MONGO_URL: The URL of the MongoDB database used by the bot to store relevant information.
- PREFIX: The prefix of all commands that the bot will check for before parsing commands.
