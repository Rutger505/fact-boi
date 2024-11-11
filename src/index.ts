import {Client, GatewayIntentBits, Collection} from 'discord.js';
import {loadCommands, loadRegisterCommands} from './handlers/commandHandler';
import {loadEvents} from './handlers/eventHandler';

declare module 'discord.js' {
    export interface Client {
        commands: Collection<string, any>;
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,           // Required for basic guild operations
        GatewayIntentBits.GuildMembers,     // For member-related events
        GatewayIntentBits.GuildMessages,    // Required to receive messages
        GatewayIntentBits.MessageContent    // Required to read message content
    ],
});

client.commands = new Collection();

// Initialize handlers
(async () => {
    try {
        const commands = await loadCommands(client);
        await loadEvents(client);
        await loadRegisterCommands(client, commands);
        await client.login(process.env.DISCORD_TOKEN);
    } catch (error) {
        console.error('Error during startup:', error);
        process.exit(1);
    }
})();