const { EmbedBuilder } = require('discord.js');
const { embedcolor, owners } = require('../config.json');
const { getUserCredits, updateUserCredits } = require('../utils/creditsUtils');

module.exports = {
    name: 'remove',
    description: 'Enlève des crédits à un joueur.',
    async execute(message, args) {
        if (!owners.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('<a:offline:1242815348273578035>  Accès refusé')
                        .setDescription("Vous n'avez pas **les autorisations nécessaires** pour utiliser cette commande.")
                        .setThumbnail('https://i.goopics.net/im2v8n.jpg'),
                ],
            });
        }

        const targetId = args[0];
        const amount = parseInt(args[1], 10);

        if (isNaN(amount) || amount <= 0) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('<a:offline:1242815348273578035>  Montant invalide')
                        .setDescription("Le montant doit être** un nombre positif.**")
                        .setThumbnail('https://i.goopics.net/9o8t9l.png'),
                ],
            });
        }

        const targetCredits = getUserCredits(targetId);
        const previousCredits = targetCredits.credits;

        if (previousCredits < amount) {
            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor(embedcolor)
                        .setTitle('<a:offline:1242815348273578035>  Opération impossible')
                        .setDescription("L'utilisateur n'a pas **suffisamment de crédits à retirer**.")
                        .setThumbnail('https://i.goopics.net/9o8t9l.png'),
                ],
            });
        }

        updateUserCredits(targetId, previousCredits - amount);

        const embed = new EmbedBuilder()
            .setColor(embedcolor)
            .setTitle('<a:2659tadapurple:1242815678835069071>  Retrait Réussi')
            .setDescription(`**L'utilisateur **a maintenant une **balance** de ${previousCredits}** CR **➡ ${previousCredits - amount}** CR**.`)
            .setThumbnail('https://i.goopics.net/aymiw8.png');

        return message.reply({ embeds: [embed] });
    },
};
