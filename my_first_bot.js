const { Client, GatewayIntentBits, Partials, Events, REST, Routes, ButtonBuilder, ButtonStyle, ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');
require('dotenv').config();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
	partials: [Partials.Message, Partials.Channel]
});

client.once(Events.ClientReady, async () => {
	console.log(`✅ Bot connecté en tant que ${client.user.tag}`);

	const channel = await client.channels.fetch('ID_DU_SALON');
	const pinnedMessages = await channel.messages.fetchPinned();
	const alreadyPinned = pinnedMessages.find(msg => msg.author.id === client.user.id);

	if (!alreadyPinned) {
		const button = new ButtonBuilder()
			.setCustomId('open_linkedin_modal')
			.setLabel('Ajouter un post LinkedIn')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(button);
		const message = await channel.send({ content: 'Clique sur le bouton pour ajouter un post LinkedIn !', components: [row] });
		await message.pin();
	}
});

client.on(Events.InteractionCreate, async interaction => {
	if (interaction.isButton() && interaction.customId === 'open_linkedin_modal') {
		const modal = new ModalBuilder()
			.setCustomId('linkedin_post_modal')
			.setTitle('Ajouter un post LinkedIn');

		const titleInput = new TextInputBuilder()
			.setCustomId('post_title')
			.setLabel('Titre du post')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const urlInput = new TextInputBuilder()
			.setCustomId('post_url')
			.setLabel('URL du post LinkedIn')
			.setStyle(TextInputStyle.Short)
			.setRequired(true);

		const row1 = new ActionRowBuilder().addComponents(titleInput);
		const row2 = new ActionRowBuilder().addComponents(urlInput);

		modal.addComponents(row1, row2);

		await interaction.showModal(modal);
	}

	if (interaction.isModalSubmit() && interaction.customId === 'linkedin_post_modal') {
		const title = interaction.fields.getTextInputValue('post_title');
		const url = interaction.fields.getTextInputValue('post_url');

		await interaction.reply({
			content: `✅ Post ajouté : **${title}**\n🔗 ${url}`,
			ephemeral: true
		});
	}
});

client.login(process.env.DISCORD_TOKEN);
