const { Client, GatewayIntentBits, Collection, ChannelType } = require('discord.js');
const config = require('./config');
const commandHandler = require('./src/handlers/commandHandler');
const buttonHandler = require('./src/handlers/buttonHandler');
const modalHandler = require('./src/handlers/modalHandler');
const selectMenuHandler = require('./src/handlers/selectMenuHandler');
const logger = require('./src/utils/logger');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
  ]
});

client.commands = new Collection();
client.buttons = new Collection();
client.modals = new Collection();
client.selectMenus = new Collection();

client.on('ready', async () => {
  logger.info(`✅ Bot conectado como ${client.user.tag}`);
  client.user.setActivity('apostas ao vivo', { type: 'WATCHING' });
  
  // Registrar comandos slash
  try {
    const commands = await client.application.commands.fetch();
    logger.info(`📊 ${commands.size} comandos registrados`);
  } catch (error) {
    logger.error('Erro ao buscar comandos:', error);
  }
});

client.on('interactionCreate', async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;
      await command.execute(interaction, client);
    } 
    else if (interaction.isButton()) {
      const button = client.buttons.get(interaction.customId.split('_')[0]);
      if (!button) return;
      await button.execute(interaction, client);
    } 
    else if (interaction.isModalSubmit()) {
      const modal = client.modals.get(interaction.customId.split('_')[0]);
      if (!modal) return;
      await modal.execute(interaction, client);
    } 
    else if (interaction.isStringSelectMenu()) {
      const menu = client.selectMenus.get(interaction.customId.split('_')[0]);
      if (!menu) return;
      await menu.execute(interaction, client);
    }
  } catch (error) {
    logger.error('Erro na interação:', error);
    if (!interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: '❌ Erro ao processar ação', ephemeral: true }).catch(() => {});
    }
  }
});

// Carregar handlers
commandHandler.load(client);
buttonHandler.load(client);
modalHandler.load(client);
selectMenuHandler.load(client);

client.login(config.TOKEN);