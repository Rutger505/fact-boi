import { Client } from "discord.js";
import { readdir } from "fs/promises";
import { join } from "path";

export async function loadEvents(client: Client) {
  const eventsPath = join(process.cwd(), "src", "events");
  const eventFiles = await readdir(eventsPath);

  for (const file of eventFiles) {
    if (!file.endsWith(".ts")) continue;

    const event = await import(join(eventsPath, file));
    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
    console.log(`Loaded event: ${event.name}`);
  }
}
