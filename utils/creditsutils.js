const fs = require('fs');

function safeReadJSON(filePath) {
    if (!fs.existsSync(filePath) || fs.readFileSync(filePath, 'utf-8').trim() === '') {
        return {}; // Retourne un objet vide si le fichier n'existe pas
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
        console.error("Erreur lors de l'analyse du fichier JSON :", e);
        return {}; // Retourne un objet vide en cas d'erreur
    }
}

function getUserCredits(userId) {
    const creditsData = safeReadJSON('./credits.json'); // Lit le fichier de crédits
    return creditsData[userId] || { credits: 0 }; // Retourne les crédits pour l'utilisateur
}

function updateUserCredits(userId, credits) {
    const creditsData = safeReadJSON('./credits.json');
    creditsData[userId] = { credits }; // Met à jour les crédits
    fs.writeFileSync('./credits.json', JSON.stringify(creditsData, null, 2), 'utf-8'); // Sauvegarde les changements
}

module.exports = {
    getUserCredits,
    updateUserCredits,
};
