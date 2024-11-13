import { Client, Collection, GatewayIntentBits } from "discord.js";
import { loadCommands, registerCommands } from "./handlers/commandHandler";
import { loadEvents } from "./handlers/eventHandler";

declare module "discord.js" {
  export interface Client {
    commands: Collection<string, any>;
  }
}

// Create a new client instance with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // Required for basic guild operations
    GatewayIntentBits.GuildMembers, // For member-related events
    GatewayIntentBits.GuildMessages, // Required to receive messages
    GatewayIntentBits.MessageContent, // Required to read message content
  ],
});

client.commands = new Collection();

// Initialize handlers
(async () => {
  try {
    const commands = await loadCommands(client);
    await loadEvents(client);
    await registerCommands(commands);
    await client.login(process.env.DISCORD_TOKEN);
  } catch (error) {
    console.error("Error during startup:", error);
    process.exit(1);
  }
})();
