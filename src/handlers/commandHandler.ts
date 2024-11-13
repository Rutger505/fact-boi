import { Client, REST, Routes } from 'discord.js';
import { readdir } from 'fs/promises';
import { join } from 'path';
import env from "../env";
import type { APIApplicationCommand } from 'discord-api-types/v10';

export async function loadCommands(client: Client) {
    const commandsPath = join(process.cwd(), 'src', 'commands');
    const commandFiles = await readdir(commandsPath);
    const commands: any[] = [];

    for (const file of commandFiles) {
        if (!file.endsWith('.ts')) continue;

        const command = await import(join(commandsPath, file));
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
            console.log(`Loaded command: ${command.data.name}`);
        }
    }

    return commands;
}

export async function loadRegisterCommands(commands: any[]) {
    const discordToken = env.DISCORD_TOKEN;
    const clientId = env.CLIENT_ID;

    if (!discordToken || !clientId) {
        console.error('Environment variables check:', {
            hasToken: !!discordToken,
            hasClientId: !!clientId
        });
        throw new Error('Missing required environment variables (TOKEN or CLIENT_ID)');
    }

    console.log('Initializing REST client...');
    const rest = new REST().setToken(discordToken);

    console.log(`Started refreshing ${commands.length} application (/) commands.`);

    try {
        let data: APIApplicationCommand[];

        console.log('Registering commands globally...');
        data = await rest.put(
            Routes.applicationCommands(clientId),
            { body: commands },
        ) as APIApplicationCommand[];
        console.log('Registered commands globally');

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        return data;
    } catch (error) {
        console.error('Error registering commands:', error);
        throw error;
    }
}
