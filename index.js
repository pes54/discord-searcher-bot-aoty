const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { prefix, token } = require('./config.json');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.DirectMessages,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
        Partials.Reaction,
    ]
});

client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.once('ready', async () => {
    console.log('Ready!');
    try {
        await client.user.setPresence({
            status: 'dnd',
            activities: [{
                name: "I'm online!",
                type: 'PLAYING'
            }]
        });
        console.log('Presence updated successfully!');
    } catch (error) {
        console.error('Error updating presence:', error);
    }
});

client.on('messageCreate', message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    if (!client.commands.has(commandName)) return;

    const command = client.commands.get(commandName);

    try {
        command.execute(message, args, client);
    } catch (error) {
        console.error(error);
        message.reply('There was an error trying to execute that command!');
    }
});

client.login(token);
