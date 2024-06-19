const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { spawn } = require('child_process');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { embedcolor } = require('../config.json');
const { getUserCredits, updateUserCredits } = require('../utils/creditsutils');
const { allowedChannelId } = require ('../config.json')
const xboxEmojiId = '1242525221081317446';
const microsoftEmojiId = '1242525222343671828';
const deleteEmojiId = '1242525217671086080';
const xboxemoji = '1242554458647429150';


module.exports = {
    name: 'xbox',
    description: "Recherche les informations Xbox et Microsoft d'un utilisateur Discord.",
    async execute(message, args) {
        
        if (message.channel.id !== allowedChannelId) {
            const wrongChannelEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059> Erreur')
                .setDescription('**ette commande ne peut être utilisée que dans CMD**.')
                .setThumbnail('https://i.goopics.net/rx22by.png');

            const reply = await message.reply({ embeds: [wrongChannelEmbed] });

            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000); // Supprime après 5 secondes

            return;
        }
        
        if (!args[0] || !/^\d+$/.test(args[0])) {
            const invalidIdEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059>  ID Discord invalide')
                .setDescription('L\'ID Discord doit être composé uniquement de chiffres.')
                .setThumbnail('https://i.goopics.net/9o8t9l.png');
        
            const reply = await message.reply({ embeds: [invalidIdEmbed] });
            
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 3000); // Supprime après 5 secondes
        
            return;
        }

        const userId = message.author.id;
        const requiredCredits = 1;

        let blacklist = [];
        try {
            blacklist = JSON.parse(fs.readFileSync('./data/blacklist.json'));
        } catch (error) {
            console.error('Erreur lors du chargement de la liste noire :', error);
        }

        if (blacklist.includes(userId)) {
            const blacklistEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059>  Accès refusé')
                .setDescription('Vous êtes **blacklisté** et ne pouvez pas utiliser **cette commande.**')
                .setThumbnail('https://i.goopics.net/ylq7w7.png');

            return message.reply({ embeds: [blacklistEmbed] });
        }

        const searchingEmbed = new EmbedBuilder()
            .setColor(embedcolor)
            .setTitle(' <a:animatedloading3:1242563684241506335>  Recherche en cours...')
            .setDescription(' Veuillez **patienter...**')
            .setThumbnail('https://i.goopics.net/ylq7w7.png');

        const searchingMessage = await message.reply({ embeds: [searchingEmbed] });

        const userCredits = getUserCredits(userId);
        if (userCredits.credits < requiredCredits) {
            const noCreditsEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle(':no_entry_sign: Crédits insuffisants')
                .setDescription(`** Crédits insuffisant ! ** . Vous avez actuellement **${userCredits.credits} crédits**.`)
                .setThumbnail('https://i.goopics.net/af4muy.png');

            const reply = await message.reply({ embeds: [noCreditsEmbed] });
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000);

            searchingMessage.delete().catch(console.error);

            return;
        }

        const query = args[0];

        const databaseDirectory = './databases';
        const files = fs.readdirSync(databaseDirectory);

        const searchResults = [];

        files.forEach(file => {
            const filePath = path.join(databaseDirectory, file);
            const fileContent = fs.readFileSync(filePath, 'utf8');
            if (fileContent.includes(query)) {
                searchResults.push(fileContent);
            }
        });

        if (searchResults.length > 0) {
            updateUserCredits(userId, userCredits.credits - requiredCredits);

            let currentPage = 0;

            const generateEmbed = (page) => {
                const info = searchResults[page].split(',').map(item => item.trim());
                const xbl_value = info.find(item => item.includes("xbl")) ? info.find(item => item.includes("xbl")).replace(/'/g, '').replace(/"/g, '').split(':')[1] : "None";
                const live_value = info.find(item => item.includes("live")) ? info.find(item => item.includes("live")).replace(/'/g, '').replace(/"/g, '').split(':')[1] : "None";
                const fileInfo = path.parse(info[0]);

                return new EmbedBuilder()
                    .setTitle(` <:coeur:1242554433574015209>  Recherche pour ${query} `)
                    .setColor(embedcolor)
                    .setDescription(`**Base de données :**`)
                    .addFields(  
                        { name: `\`${fileInfo.name}\``, value: '\u200B' },
                        { name: `<:xbox:${xboxEmojiId}> Xbox`, value: `\`${xbl_value}\``, inline: false },
                        { name: `<:microsoft:${microsoftEmojiId}> Microsoft Live`, value: `\`${live_value}\``, inline: false }
                    )
                    .setThumbnail('https://i.goopics.net/ylq7w7.png')
                    .setFooter({ text: `Page ${page + 1}/${searchResults.length} | ${userCredits.credits - requiredCredits} crédits restant.` });
            };

            const generateButtons = (page) => {
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prevPage')
                            .setLabel('◀️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('xboxInfo')
                            .setLabel('Xbox')
                            .setEmoji(xboxemoji)
                            .setStyle(ButtonStyle.Success),
                        new ButtonBuilder()
                            .setCustomId('deleteEmbed')
                            .setLabel('Supprimer')
                            .setEmoji(deleteEmojiId)
                            .setStyle(ButtonStyle.Danger),
                        new ButtonBuilder()
                            .setCustomId('nextPage')
                            .setLabel('▶️')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === searchResults.length - 1)
                    );
            };

            const embed = generateEmbed(currentPage);
            const row = generateButtons(currentPage);

            const reply = await message.reply({ embeds: [embed], components: [row] });

            const filter = i => ['prevPage', 'xboxInfo', 'deleteEmbed', 'microsoftInfo', 'nextPage'].includes(i.customId) && i.user.id === userId;
            const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

            collector.on('collect', async i => {
                if (i.customId === 'prevPage') {
                    currentPage--;
                } else if (i.customId === 'nextPage') {
                    currentPage++;
               // } else if (i.customId === 'xboxInfo') {
                 //   try {
                 //       const xbl_value = searchResults[currentPage].split(',').find(item => item.includes("xbl")).split(':')[1].replace(/'/g, '').replace(/"/g, '').trim();
                 //                       
                //      
                  //      const apiKey = 'cd7089e3-d426-40b6-8c69-8f298c0912e2';
                                
                        // Requête pour obtenir les informations publiques de l'utilisateur Xbox
                  //      const response = await axios.get(`https://profile.xboxlive.com/users/xuid(${xbl_value})/profile`, {
                  //          headers: {
                 //               'X-Authorization': `XBL3.0 x=${apiKey}`
                  //          }
                  //      });
                  //              
                 //       const profileData = response.data.profileUsers[0].profileUsers[0];
                 //       const gamerTag = profileData.gamertag;
               //         const bio = profileData.bio;
               //         const location = profileData.location;
              //          const reputation = profileData.reputation;
               //         const followers = profileData.followersCount;
                //        const followersUrl = `https://account.xbox.com/en-US/Profile?xr=mebarnav&id=${xbl_value}`;
                  //      const gameDisplayPicRaw = profileData.gameDisplayPicRaw;
                //
                 //       let xboxInfoMessage = `Informations publiques Xbox pour ${gamerTag}\n`;
                 //       xboxInfoMessage += `**Bio:**\n${bio}\n\n`;
               //         xboxInfoMessage += `**Location:**\n${location}\n\n`;
               //         xboxInfoMessage += `**Reputation:**\n${reputation}\n\n`;
              //          xboxInfoMessage += `[Followers](${followersUrl}): ${followers}`;
                
                        // Vérifier si l'interaction a déjà été répondu ou différé
              //          if (!i.deferred && !i.replied) {
                //            await i.reply(xboxInfoMessage);
             //           }
                                
            //        } catch (error) {
               //         console.error(error);
                        // Vérifier si l'interaction a déjà été répondu ou différé
             //           if (!i.deferred && !i.replied) {
                            ;
              //          }
            //       }
                
                //} else if (i.customId === 'microsoftInfo') {
               //     try {
               //         const live_value = searchResults[currentPage].split(',').find(item => item.includes("live")).split(':')[1].replace(/'/g, '').replace(/"/g, '').trim();
                        // Ajoutez votre code pour récupérer les informations Microsoft ici
              //      } catch (error) {
              //          console.error(error);
                        // Vérifier si l'interaction a déjà été répondu ou différé
              //          if (!i.deferred && !i.replied) {
                    //        await i.reply('Erreur lors de la récupération des informations Microsoft.');
              //          }
                 //   }
                } else if (i.customId === 'deleteEmbed') {

                    await reply.delete();
                    await message.delete();
                    collector.stop();
                    return;
                }
            
                // Mettre à jour l'interaction si elle n'a pas déjà été répondu ou différé
                if (!i.deferred && !i.replied) {
                    await i.update({ embeds: [generateEmbed(currentPage)], components: [generateButtons(currentPage)] });
                }
            });
            
            collector.on('end', () => {
                row.components.forEach(component => component.setDisabled(true));
                reply.edit({ components: [row] }).catch(console.error);
            });
            
            searchingMessage.delete().catch(console.error);

            return;
        } else {
            const retryEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:cross:1242563686904889445> Aucune **information** trouvée')
                .setDescription('Vous pouvez **essayer avec :**\n<a:A_arrow2:1242563691371565179> **Discord ID**\n<a:A_arrow2:1242563691371565179> **FiveM**\n<a:A_arrow2:1242563691371565179> **Pseudo**')
                .setThumbnail('https://i.goopics.net/im2v8n.jpg')
                .setFooter({ text: `${userCredits.credits} crédits restant.` });

            const reply = await message.reply({ embeds: [retryEmbed], ephemeral: true });
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 7000);

            searchingMessage.delete().catch(console.error);
        }
    },
};
