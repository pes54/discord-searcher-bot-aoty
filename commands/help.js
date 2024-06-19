const fs = require('fs');
const { EmbedBuilder } = require('discord.js');
const { embedcolor } = require('../config.json');

module.exports = {
    name: 'help',
    description: 'Affiche la liste des commandes disponibles.',
    execute(message, args) {
        const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

        const commandList = commandFiles.map(file => {
            const command = require(`./${file}`);
            return `**${command.name}**: ${command.description}`;
        }).join('\n');

        const helpEmbed = new EmbedBuilder()
            .setColor(embedcolor)
            .setTitle('Liste des commandes')
            .setDescription(commandList);

        message.channel.send({ embeds: [helpEmbed] });
    },
};
