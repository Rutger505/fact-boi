import { Client, Events, GatewayIntentBits } from "discord.js";
import {db} from "./db";
import {users} from "./db/schema.ts";
import {eq} from "drizzle-orm";

if (!process.env.DISCORD_TOKEN) {
  throw new Error("No token provided");
}

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,           // Required for basic guild operations
    GatewayIntentBits.GuildMembers,     // For member-related events
    GatewayIntentBits.GuildMessages,    // Required to receive messages
    GatewayIntentBits.MessageContent    // Required to read message content
  ]
});

client.once(Events.ClientReady, readyClient => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.on(Events.MessageCreate, async  message => {
  if (message.author.bot) return;

  console.log(`[${message.author.tag}] ${message.content}`);

  try {
    // Check if user already exists
    const existingUser = await db.select()
      .from(users)
      .where(eq(users.id, Number(message.author.id)))
      .limit(1);

    if (existingUser.length === 0) {
      // User doesn't exist, create new user
      const newUser = await db.insert(users)
        .values({
          id: Number(message.author.id),  // Discord IDs are snowflakes (too large for int), so we might need to adjust the schema
          displayName: message.author.username
        })
        .returning();

      console.log(`Created new user: ${newUser[0].displayName}`);
    }

    console.log(`[${message.author.tag}] ${message.content}`);
  } catch (error) {
    console.error('Error handling message:', error);
  }
});

client.login(process.env.DISCORD_TOKEN);