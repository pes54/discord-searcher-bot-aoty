const Discord = require('discord.js');
const { embedcolor, owners } = require('../config.json');
const { getUserCredits, updateUserCredits } = require('../utils/creditsUtils'); // Assurez-vous que ces fonctions sont importées

module.exports = {
    name: 'add',
    description: 'Ajoute des crédits à un joueur.',
    async execute(message, args) {
        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('Accès refusé')
                        .setDescription("Vous n'avez pas les **autorisations nécessaires** pour utiliser cette commande.")
                        .setThumbnail('https://i.goopics.net/9o8t9l.png'),
                ],
            });
        }

        const targetId = args[0];
        const amount = parseInt(args[1], 10);

        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [
                    new Discord.EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('Montant invalide')
                        .setDescription("Le montant doit être un **nombre positif.**")
                        .setThumbnail('https://i.goopics.net/im2v8n.jpg'),
                ],
            });
        }

        const targetCredits = getUserCredits(targetId); // Obtenez les crédits de l'utilisateur cible
        const previousCredits = targetCredits.credits;

        updateUserCredits(targetId, previousCredits + amount); // Ajoutez des crédits

        const embed = new Discord.EmbedBuilder()
            .setColor(embedcolor)
            .setTitle('<a:__:1242742362992676914>  Ajout de crédits')
            .setDescription(`**L'utilisateur a maintenant :** ${previousCredits} **CR** ➡ ${previousCredits + amount} **CR**.`)
            .setThumbnail('https://i.goopics.net/rx22by.png');

        return message.reply({ embeds: [embed] });
    },
};
