const { EmbedBuilder } = require('discord.js');
const fs = require('fs');
const { embedcolor, owners } = require('../config.json');
const path = require('path');
const { getUserCredits, updateUserCredits } = require('../utils/creditsUtils');

const CLAIM_INTERVAL = 12 * 60 * 60 * 1000; // 12 heures en millisecondes
const claimsPath = path.join(__dirname, '../data/claims.json');

// Fonction pour lire le dernier moment de "claim"
function getLastClaimTime(userId) {
    if (!fs.existsSync(claimsPath)) {
        fs.writeFileSync(claimsPath, '{}'); // Créer le fichier si non existant
    }

    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'));
    return claimsData[userId] || 0;
}

// Fonction pour mettre à jour le dernier moment de "claim"
function updateLastClaimTime(userId) {
    const claimsData = JSON.parse(fs.readFileSync(claimsPath, 'utf-8'));
    claimsData[userId] = Date.now();
    fs.writeFileSync(claimsPath, JSON.stringify(claimsData, null, 2));
}

module.exports = {
    name: 'claim',
    description: 'Récupérer 10 crédits toutes les 12 heures.',
    async execute(message) {
        const userId = message.author.id;

        // Charge la liste noire
        let blacklist = [];
        try {
            blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
        } catch (error) {
            console.error('Erreur lors du chargement de la liste noire :', error);
        }

        // Vérifie si l'utilisateur est blacklisté
        if (blacklist.includes(userId)) {
            // Si l'utilisateur est blacklisté, informe l'utilisateur et arrête l'exécution de la commande
            const blacklistEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:__:1242742362992676914>  Accès refusé')
                .setDescription('Vous êtes **blacklisté** et ne pouvez pas utiliser **cette commande.**')
                .setThumbnail('https://i.goopics.net/9o8t9l.png');

            return message.reply({ embeds: [blacklistEmbed] });
        }

        const lastClaimTime = getLastClaimTime(userId);

        const currentTime = Date.now();
        const timeSinceLastClaim = currentTime - lastClaimTime;

        if (timeSinceLastClaim < CLAIM_INTERVAL) {
            const remainingTime = CLAIM_INTERVAL - timeSinceLastClaim;
            const hours = Math.floor(remainingTime / (60 * 60 * 1000));
            const minutes = Math.floor((remainingTime % (60 * 60 * 1000)) / (60 * 1000));

            const notYetEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:__:1242742362992676914>   Échec de la réclamation ')
                .setDescription(`> <:t_:1242525219361390753>  Vous devez **attendre ${hours} heures et ${minutes} minutes avant de pouvoir utiliser la commande** "claim" à nouveau.`)
                .setThumbnail('https://i.goopics.net/rx22by.png');

            return message.reply({ embeds: [notYetEmbed] });
        }

        const userCredits = getUserCredits(userId);
        const newCreditBalance = userCredits.credits + 10;

        updateUserCredits(userId, newCreditBalance);
        updateLastClaimTime(userId);

        const successEmbed = new EmbedBuilder()
    .setColor(embedcolor)
    .setTitle('<a:gift:1242738509970669568>  Crédit récupéré')
    .setDescription('Vous avez reçu vos crédits.')
    .setFooter({ text: `Vous avez maintenant ${newCreditBalance} crédits.` })
    .setThumbnail('https://i.goopics.net/af4muy.png');

        await message.reply({ embeds: [successEmbed] });
    },
};
