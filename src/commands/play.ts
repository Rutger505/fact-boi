import {
  ActionRowBuilder,
  StringSelectMenuBuilder,
  SlashCommandBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  StringSelectMenuInteraction,
} from "discord.js";
import type {
  MessageActionRowComponentBuilder,
  InteractionReplyOptions,
  CacheType,
} from "discord.js"; // Importing type-only

const userSelections = new Map(); // Store user selections

// Create the first ActionRow with the trivia category select menu
const categoryRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("trivia_category")
      .setPlaceholder("Choose a trivia category")
      .addOptions(
        {
          label: "General Knowledge",
          description: "Test your knowledge in General Knowledge!",
          value: "9",
        },
        {
          label: "Books",
          description: "How well do you know Books?",
          value: "10",
        },
        {
          label: "Films",
          description: "Show off your Film skills!",
          value: "11",
        },
        {
          label: "Music",
          description: "Questions about music!",
          value: "12",
        },
        {
          label: "Video Games",
          description: "Questions about video games!",
          value: "15",
        },
        {
          label: "Nature",
          description: "Questions about Nature!",
          value: "17",
        },
        {
          label: "Computers",
          description: "Questions about computers!",
          value: "18",
        },
        {
          label: "Sports",
          description: "Questions about Sports!",
          value: "21",
        },
        {
          label: "Geography",
          description: "Questions about music!",
          value: "22",
        },
        {
          label: "History",
          description: "Questions about History!",
          value: "23",
        },
        {
          label: "Politics",
          description: "Questions about Politics!",
          value: "24",
        },
        {
          label: "Anime and Manga",
          description: "Questions about Anime and manga!",
          value: "31",
        }
      )
  );

// Create the second ActionRow with the difficulty select menu
const difficultyRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("difficulty")
      .setPlaceholder("Set your difficulty")
      .addOptions(
        { label: "Easy", value: "easy" },
        { label: "Medium", value: "medium" },
        { label: "Hard", value: "hard" }
      )
  );

// Create the type select menu
const typeRow =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("type")
      .setPlaceholder("Choose gamemode")
      .addOptions(
        { label: "Multiple Choice", value: "multiple" },
        { label: "True/False", value: "boolean" }
      )
  );

// Play button to start the trivia
const playButton =
  new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
    new ButtonBuilder()
      .setCustomId("start_button")
      .setLabel("Start Trivia")
      .setStyle(ButtonStyle.Primary)
  );

export const data = new SlashCommandBuilder()
  .setName("play")
  .setDescription("Play Trivia!!!");

export async function execute(
  interaction: CommandInteraction<CacheType>
): Promise<void> {
  const replyOptions: InteractionReplyOptions = {
    content: `Choose a trivia category and set your difficulty to get started!`,
    components: [categoryRow, difficultyRow, typeRow, playButton],
  };

  await interaction.reply(replyOptions);
}
