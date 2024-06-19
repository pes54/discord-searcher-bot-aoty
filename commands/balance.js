const fs = require('fs');
const { MessageEmbed, EmbedBuilder } = require('discord.js');
const { embedcolor, thumbail1, thumbail2 } = require('../config.json');
const { getUserCredits } = require('../utils/creditsUtils'); // Importer les fonctions utilitaires



module.exports = {
    name: 'balance',
    description: 'Affiche le nombre de crédits d\'un utilisateur.',
    async execute(message, args) {
        const userId = args[0] ? args[0].replace(/[<@!>]/g, '') : message.author.id;

        // Charger la liste noire
        let blacklist = [];
        try {
            blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
        } catch (error) {
            console.error('Erreur lors du chargement de la liste noire :', error);
        }

        // Vérifier si l'utilisateur est blacklisté
        if (blacklist.includes(userId)) {
            // Si l'utilisateur est blacklisté, informer l'utilisateur et arrêter l'exécution de la commande
            const blacklistEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:__:1242742362992676914>  Accès refusé')
                .setDescription('Vous êtes **blacklisté** et ne pouvez pas utiliser cette commande.')
                .setThumbnail('https://i.goopics.net/af4muy.png');

            return message.reply({ embeds: [blacklistEmbed] });
        }

        const userCredits = getUserCredits(userId); // Obtenir les crédits de l'utilisateur

        // Vérifier si l'utilisateur existe dans la base de données
        if (!userCredits) {
            const errorEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:Warning:1242554406084415509>  Utilisateur introuvable')
                .setDescription('Cet **utilisateur** n\'a pas de crédits.')
                .setThumbnail('https://i.goopics.net/rx22by.png');

            return message.reply({ embeds: [errorEmbed] });
        }

        // Sélectionner aléatoirement une miniature parmi les thumbnails disponibles
       

        const balanceEmbed = new EmbedBuilder()
            .setColor(embedcolor)
            .setTitle(`Crédits : ${userId === message.author.id ? '' : `<@${userId}>`} :`)
            .setDescription(`Cet **utilisateur** a : **${userCredits.credits}** crédits.`)
            .setThumbnail('https://i.goopics.net/9o8t9l.png');

        return message.reply({ embeds: [balanceEmbed] });
    },
};
