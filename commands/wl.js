const fs = require('fs');
const { MessageButton, MessageActionRow } = require('discord.js');

module.exports = {
    name: 'wl',
    description: 'Manage whitelist of bot owners',
    execute(message, args) {
        if (!fs.existsSync('./config.json')) {
            return message.channel.send('Configuration file not found.');
        }

        const config = require('../config.json');

        if (!config.owners || !Array.isArray(config.owners)) {
            return message.channel.send('Owners list not found in configuration file.');
        }

        if (!config.owners.includes(message.author.id)) {
            return message.channel.send("You don't have permission to use this command.");
        }

        const subcommand = args.shift()?.toLowerCase();

        if (subcommand === 'add') {
            const ownerID = args[0];
            if (!config.owners.includes(ownerID)) {
                config.owners.push(ownerID);
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
                return message.channel.send(`Owner ${ownerID} added to whitelist.`);
            } else {
                return message.channel.send(`Owner ${ownerID} is already in the whitelist.`);
            }
        } else if (subcommand === 'remove') {
            const ownerID = args[0];
            const index = config.owners.indexOf(ownerID);
            if (index !== -1) {
                config.owners.splice(index, 1);
                fs.writeFileSync('./config.json', JSON.stringify(config, null, 4));
                return message.channel.send(`Owner ${ownerID} removed from whitelist.`);
            } else {
                return message.channel.send(`Owner ${ownerID} is not in the whitelist.`);
            }
        } else if (subcommand === 'list') {
            return message.channel.send(`Whitelisted Owners: ${config.owners.join(', ')}`);
        } else {
            return message.channel.send('Invalid subcommand. Usage: `!wl add <ownerID>`, `!wl remove <ownerID>`, `!wl list`.');
        }
    },
};
