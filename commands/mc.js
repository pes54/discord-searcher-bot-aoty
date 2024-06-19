const fs = require('fs');
const path = require('path');
const { EmbedBuilder } = require('discord.js');
const { embedcolor, VIP } = require('../config.json');
const { getUserCredits } = require('../utils/creditsutils');
const { allowedChannelId } = require('../config.json');
function hasVIPRole(member) {
    return member.roles.cache.has(VIP);
}
function generateAsciiArt() {

    return `
                                                                                                                                                                                                                                                                                                     
                                                                                                            ,                                         
                                                                                                       *##,                                           
                                                                                                  ./#%#,                                              
                                                                                             /,#####.                                                 
                                             ,         ..,#%%######%####%%(,,           ,/#######.                                                    
                                            /@.#################%#############%#%#%#%#%%######.                                                       
                                         .%,@@@*########%#######%##########%.%%#%#######%####%/.                                                      
                                     *##%##@@@@@################%#######(###/########################%.                                               
                                   (######*@@@@@*###############%###########,###################%########&@*                                          
                                ,########%*@@@@@,###############%######(####*#############################&@&&(                                       
                              ,%%%##########(,,%%%##############%##%##((###%####%###############%########&&&@@&&@#                                    
                             ,##%(%########%/###################%####(((####*%####.####################&&@%&&@@@@@&@.                                 
                            (#((#########%,%####################%###((((###.#%/####*###############%@@&&@@@&@,@@@@@@@&/                               
               .///////////(((######/./##%#%%#%##########,######%##(*((###%%&*%,####,#########%&&@@@&@&&@&@@@&&,&&@@@@&&(                             
           /////////////,///,###%###%%%,%#&#(###%###%###,###%###%##,&#(#%#(&&&&&#%###/&@@&&@@@@@&@@@@@@@@*&@@@@@@.#&@@&&@&*                           
           *////////*///*///########%%###%*##%#########,####%#####*&&%(##%*&&&(&&#%##%,#%%#######%%###########%%&&*   ,&&&&&*                         
           .///////./////*///%####%##%###*#%#######%%%,&&&&%%%%##*&&&%(##%&&&&%&&&%(%#/#%####,%#%#/%(#%####%#######(      ,@&&                        
            .//////,///***///.##(#%/####(#%%%#######(/##########(&&&&####,&&&&&#&&&&*###%,%%#####%##((######%########         @,                      
             .////*///****////##%%#%###(######%####((%#########%&&&&&(###%&&&&&(&&&&&*((&&*%####%##*(((####%#%%#%###%/          ,                     
               /.////****/////*###%###,#######%%//((*########%&&&&&&&/##*&&&&&&&&&&&%&*#%&&%%%#####%((((######*%######,                               
               //////**///////,#%(%##(##%#######(((/%#(,(#%##&&&&&%##*(%&&&&&&&&#&&&&&&/*&&&@###%###/(((###############                               
             ,////////////////*#,####/#########(((((#####%##&&&&&&&&&*%*&&&&&&&&,&&&&&&&/&&&#//#####,((((######*(######(                              
           .///////////////////(%###.###%#####((((/#######(&&&&&&&&&&((&&&&&&&&&#&&&&&&%/&%     %%#%*((((######.((######.                             
           .///////////////////(##%*,########(((/&*#%%##%*&&&&&&&&&&&%@&&&&&&&&&&&&&&&*   (*** &,#%%*(((((####%*(((#####/                             
              ////////////////,#%%((,#######(((*&&,(%%##*&&&&&&/*%&&%&&&&&&&&&&&&&&&& %@@@****&&&,##*(((((####%   (######                             
                *//////////////#%(((/####%#((((&      ..,,.        &&&&&&&&&&&&&&&&&&%%*(*****&&&&*#*(((((####/    .%###%(                            
                /#,///////////#%((((#######((#&&&,,#%#@@@@&*******,&&&&&&&&&&&&&&&&&&@&*/****,&&&/(/,.((((####.      (###.                            
                *%##(*///////,%/(((,######((%&&&&%##,%%.***********&&&&&&&&&&&&&&&&&&@&*%/*##@&&*(((*(,(((###/,       ,##,                            
                *###%#(*////*..(((&&(#####(/&&&&*##&&%&@****%******&&&&&&&&&&&&&&&&&&&&*%#(#.&&&(((((((/((###(          (*                            
                *##(%#(((*(*(.,((*&&*####(#&*&&&*,&&&@@@/**(%(**%#&@&&&&&&&&&&&&&&&&&&@**(*,&&&/((((((((((##,(                                        
                 #%,##(((*((((,((/&&,#%##(&&&#&&@&&&&&@@@/**%#%%##,&&&&&&&&&&&&&&&&&&&&&&&&&&&&(((((((((.(%,/(,                                       
                .##,##(((,((((*((,/&/###*(&&&&&&&&&&&&&&@@&****,(&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&((((((((((/(/(,                                       
                 %#/#((((,(((((((*(,%##,&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&*((((((((.((((                                        
                 (###((((,(((((/(((((#/*(#(,  .&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&%.(((((((#*((((((                                        
                 .%%#((((,(((((,((.((#(((((*      %&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&,((*((((((###/(((((,                                        
                 *%%#((((,(((((((((/(/((((((          /&&&&&&&&&&&&&&&&&&&%*&&&&&&&&&/  .((((((((((%##/((((((.                                        
                  %%#((((*(((((( ((*((((((((,               ,,%&&&&&&&&&&&&&&&&&*       ,(((((((((%%##/((((((*                                        
                  (%#((((/((((((.,((.((((((((.             .***.%%%%##%%%%.******.      (((((((((####*(((((((                                         
                  *%#(((((((((((, (((*(((((((/         .///****.%%%%%%%%%%##.*******.  .((*#(((######((((((((                                         
                  .%#(((((((((((,  /((/(((((((.     ,//////**%%#%%%%%%%%%%%.*******////,(,%(((#####%(((((((((                                         
                  ,%((((((((((((,,  (((/(((((((/.&/////////**%%%%%%%%%%%#%,/****///////(/#(((#####%((((((((/*                                         
                   %((((((((((((*,   *((,((((/&//@@/////////*%%%%%%%%%%%#,***/////////*(##(#######,((((((((/,                                         
                   %((((((/(((((//    .((/(((*%@/,@%/////////&&((/////(#*////////////,,.########%  ((((((((/,                                         
                   %((((((*(((((((      /((*,*/@&/*@#////////@@@@@@@@@@(/////////*&@@%*########%&/.((((((((/                                          
                   #((((((,(((((((,      ,(*@@**@#/,@@///////&@@@@@@@@@///////,@@@./,@*#######%&@@&((((((((*                                          
                   (((((((.((((((//       (@@@@*/@&/,@@*/////#@@@@@@@@(////*&@@,/,@@&.%######%@@@@@%(((((((*                                          
                   ,((((((,((((((*(,     ,@@@@@@,/%@*/&@*////,@@@@@@@*///#@@,/,@@#///(##%###%&@@@@@@*((((((,                                          
                   ,((((((*((((((,(,    *@@@@@@@@&(,@&/,@@*//*@@@@@@,/,@@*/*@@#///,@(#######@@@@@@@@@((((((,                                          
                    ((((((*((((((,((   *@@@@@@@@@@@,/,@*/*@&/(@@@@@##@@//%@@*//,@@@@%#####%@@@@@@@@@@/(((((,                                          
                    ((((((/((((((,((,  @@@@@@@@@@@@@@//*@,((@/*@@@@@*/,@@,///&@@@@@/%##%##@@@@@@@@@@@@(((((*                                          

                                        ┌─────────────────────────────────────────────────┐
                                        │             Résultats de recherche:             │
                                        └─────────────────────────────────────────────────┘
    `;
}

module.exports = {
    name: 'mc',
    description: "Recherche les informations Minecraft d'un utilisateur Discord.",
    async execute(message, args) {

        if (message.channel.id !== allowedChannelId) {
            const wrongChannelEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059> Erreur : ')
                .setDescription('Cette **commande ne peut être utilisée que dans CMD**.')
                .setThumbnail('https://i.goopics.net/9o8t9l.png');

            const reply = await message.reply({ embeds: [wrongChannelEmbed] });

            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000); // Supprime après 5 secondes

            return;
        }

        if (!args[0]) {
            const invalidIdEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059>  Recherche invalide')
                .setDescription("L'ID Discord est requis.")
                .setThumbnail('https://i.goopics.net/9o8t9l.png');
        
            const reply = await message.reply({ embeds: [invalidIdEmbed] });
        
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000); // Supprime après 3 secondes
        
            return;
        }

         const userId = message.author.id;
         const member = message.guild.members.cache.get(userId);

         if (!hasVIPRole(member)) {
            const noVipEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059>  Accès refusé')
                .setDescription("Vous devez avoir le **rôle VIP **pour utiliser cette **commande.**")
                .setThumbnail('https://i.goopics.net/ylq7w7.png');

            const reply = await message.reply({ embeds: [noVipEmbed] });

            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000);

            return;
        }

        const query = args[0];

        if (!query) {
            const invalidQueryEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:A_exclamation:1242563689232470059>  Recherche invalide')
                .setDescription("La recherche est invalide.")
                .setThumbnail('https://i.goopics.net/9o8t9l.png');
        
            const reply = await message.reply({ embeds: [invalidQueryEmbed] });
        
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000);
        
            return;
        }
        const databaseDirectory = './databasemc';
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
            const resultText = generateAsciiArt() + searchResults.join('\n');
            const fileName = `${query}_results.txt`;
            const filePath = path.join(__dirname, '..', 'results', fileName);

            fs.writeFileSync(filePath, resultText);

            const searchingEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:animatedloading3:1242563684241506335>  Recherche en cours...')
                .setDescription(`Les résultats seront **envoyés en privé**.`)
                .setThumbnail('https://i.goopics.net/9o8t9l.png');

            const searchingMessage = await message.reply({ embeds: [searchingEmbed] });

            try {
                await message.author.send({ content: "Résultats envoyés en message privé.", files: [filePath] });
                const resultsSentEmbed = new EmbedBuilder()
                    .setColor(embedcolor)
                    .setTitle(' <a:__:1242742362992676914> Résultats envoyés en privé !')
                    .setDescription('Consulte **tes messages privés pour voir les résultats.**')
                    .setThumbnail('https://i.goopics.net/ylq7w7.png');
                await searchingMessage.edit({ embeds: [resultsSentEmbed] }); // Met à jour le message "Recherche en cours..."
            } catch (error) {
                const errorMessage = error.message.includes('Cannot send messages to this user') ?
                    "Il semble que tu n'acceptes pas les messages privés." :
                    "Une erreur s'est produite lors de l'envoi des résultats en message privé.";

                const errorEmbed = new EmbedBuilder()
                    .setColor(embedcolor)
                    .setTitle('<a:A_exclamation:1242563689232470059> Erreur')
                    .setDescription(errorMessage)
                    .setThumbnail('https://i.goopics.net/rx22by.png');

                const reply = await message.reply({ embeds: [errorEmbed] });
                setTimeout(() => {
                    message.delete().catch(console.error);
                    reply.delete().catch(console.error);
                }, 5000);

                await searchingMessage.delete().catch(console.error);
            }

            return;
        } else {
            const retryEmbed = new EmbedBuilder()
                .setColor(embedcolor)
                .setTitle('<a:cross:1242563686904889445> Aucune **information** trouvée')
                .setDescription("Aucun résultat trouvé. Veuillez réessayer avec une autre recherche.")
                .setThumbnail('https://i.goopics.net/im2v8n.jpg');
                

            const reply = await message.reply({ embeds: [retryEmbed] });
            setTimeout(() => {
                message.delete().catch(console.error);
                reply.delete().catch(console.error);
            }, 5000);

            return;
        }
    },
};
