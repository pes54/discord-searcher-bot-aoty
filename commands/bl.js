const fs = require('fs');
const Discord = require('discord.js');
const { owners } = require('../config.json');
const { embedcolor } = require('../config.json');
const blacklistFile = './data/blacklist.json';

module.exports = {
    name: 'bl',
    description: 'Blacklist or unblacklist a user from using commands.',
    usage: '<add/remove> <user>',
    execute(message, args, client) {
        // Vérifie si l'utilisateur est un propriétaire du bot
        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                    .setColor(embedcolor)
                    .setTitle('<a:__:1242742362992676914>  Accès refusé')
                    .setDescription('Vous n\'êtes pas autorisé a **BL** des personnes .')
                    .setThumbnail('https://i.goopics.net/ylq7w7.png')
                ]
            });
        }

        // Vérifie si les arguments sont fournis
        if (args.length < 2) {
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('<a:__:1242742362992676914> Erreur :')
                        .setDescription('Vous pouvez **ADD** ou **REMOVE** .')
                        .setThumbnail('https://i.goopics.net/aymiw8.png')
                ]
            });
        }

        const action = args[0].toLowerCase();
        const userId = args[1].replace(/[\\<>@!]/g, ''); // Obtient l'ID de l'utilisateur sans marqueurs

        // Charge la liste des utilisateurs blacklistés
        let blacklist = JSON.parse(fs.readFileSync(blacklistFile));

        // Vérifie l'action à effectuer
        switch (action) {
            case 'add':
                // Vérifie si l'utilisateur est déjà blacklisté
                if (blacklist.includes(userId)) {
                    return message.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(embedcolor)
                                .setTitle('<a:__:1242742362992676914> Erreur :')
                                .setDescription('Cette personne est deja **BL**.')
                                .setThumbnail('https://i.goopics.net/af4muy.png')
                        ]
                    });
                }

                // Ajoute l'utilisateur à la blacklist
                blacklist.push(userId);
                fs.writeFileSync(blacklistFile, JSON.stringify(blacklist));

                return message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(embedcolor)
                            .setTitle('<:coeur:1242554433574015209> Blacklist réussi ! ' )
                            .setDescription(`<@${userId}> has been **blacklisted **.`)
                            .setThumbnail('https://i.goopics.net/af4muy.png')
                    ]
                });

            case 'remove':
                // Vérifie si l'utilisateur est blacklisté
                if (!blacklist.includes(userId)) {
                    return message.reply({
                        embeds: [
                            new Discord.EmbedBuilder()
                                .setColor(embedcolor)
                                .setTitle('<a:cross:1242563686904889445> Erreur  ' )
                                .setDescription(`<@${userId}> n\'est pas **BlackList **.`)
                                .setThumbnail('https://i.goopics.net/im2v8n.jpg')
                        ]
                    });
                }

                // Retire l'utilisateur de la blacklist
                blacklist = blacklist.filter(id => id !== userId);
                fs.writeFileSync(blacklistFile, JSON.stringify(blacklist));

                return message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(embedcolor)
                            .setTitle('<:coeur:1242554433574015209> UnBlacklist réussi ! ' )
                            .setDescription(`<@${userId}> has been **unblacklisted **.`)
                            .setThumbnail('https://i.goopics.net/rx22by.png')
                    ]
                });

            default:
                return message.reply({
                    embeds: [
                        new Discord.EmbedBuilder()
                            .setColor(embedcolor)
                            .setTitle('<a:__:1242742362992676914> Erreur :')
                            .setDescription('Vous pouvez **ADD** ou **REMOVE** .')
                            .setThumbnail('https://i.goopics.net/aymiw8.png')
                    ]
                });
        }
    }
};
