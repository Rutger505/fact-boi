import { Client, Events, GatewayIntentBits } from "discord.js";

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

client.on(Events.MessageCreate, message => {
  console.log(`[${message.author.tag}] ${message.content}`);
});

client.login(process.env.DISCORD_TOKEN);