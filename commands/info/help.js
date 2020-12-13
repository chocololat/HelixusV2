const {
    oneLine,
    stripIndent
} = require("common-tags");
const {
    MessageEmbed
} = require("discord.js");
const Command = require("../../structures/Command");
const {
    capitalize
} = require("../../structures/Utils");



module.exports = class HelpCommand extends Command {
    constructor(bot) {
        super(bot, {
            name: 'help',
            aliases: ['h'],
            usage: 'help [command]',
            description: oneLine `
            Displays a list of current commands, sorted by category.
            You can also give an argument, to get more infos about a specific command.
            `,
            type: 'info',
            examples: ['help', 'help ping']
        });
    }

    async run(message, args) {
        const {
            INFO,
            GENERAL,
            OWNER,
            ADMINISTRATION,
            MUSIC,
            LEVELS,
            ECONOMY
        } = this.bot.types;
        this.bot.db.query(`SELECT * FROM Prefixes WHERE guildID='${message.guild.id}'`, (err, prefixes) => {
            if (err) throw err;

            const embed = new MessageEmbed()
            let prefix;

            if (prefixes[0]) prefix = prefixes[0].prefix;
            else prefix = "am!"

            const command = this.bot.commands.get(args[0]) || this.bot.aliases.get(args[0]);
            if (command && (command.type != OWNER)) {
                embed
                    .setTitle(`Command: \`${command.name}\``)
                    .setDescription(message.guild.lang.COMMANDS[command.name.toUpperCase()].description ? message.guild.lang.COMMANDS[command.name.toUpperCase()].description : command.description)
                    .addField('Usage', `\`${prefix}${command.usage}\``, true)
                    .addField('Type', `\`${capitalize(command.type)}\``, true)
                    .setFooter(message.member.displayName, message.author.displayAvatarURL({
                        dynamic: true
                    }))
                    .setTimestamp()
                    .setColor(message.guild.me.displayHexColor);

                if (command.aliases) embed.addField('Aliases', command.aliases.map(c => `\`${c}\``).join(' '));
                if (command.examples) embed.addField('Examples', command.examples.map(c => `\`${prefix}${c}\``).join('\n'));
                if (command.notes) embed.addField('Notes', message.guild.lang.COMMANDS[command.name.toUpperCase()].notes ? message.guild.lang.COMMANDS[command.name.toUpperCase()].notes : command.notes)
            } else {
                const commands = {};
                for (const type of Object.values(this.bot.types)) {
                    commands[type] = [];
                }

                const emojiMap = {
                    [INFO]: `📇 ${capitalize(INFO)}`,
                    [GENERAL]: `👨 ${capitalize(GENERAL)}`,
                    [OWNER]: `${capitalize(OWNER)}`,
                    [ADMINISTRATION]: `⚒️ ${capitalize(ADMINISTRATION)}`,
                    [MUSIC]: `🎵 ${capitalize(MUSIC)}`,
                    [LEVELS]: `📈 ${capitalize(LEVELS)}`,
                    [ECONOMY]: `🪙 ${capitalize(ECONOMY)}`
                }

                this.bot.commands.forEach(command => {
                    commands[command.type].push(`\`${command.name}\``);
                })

                embed
                    .setTitle('Helixus Commands')
                    .setDescription(stripIndent `
                    **More informations:** \`${prefix}help [command]\`
                    `)
                    .setTimestamp()
                    .setColor(message.guild.me.displayhexColor)

                for (const type of Object.values(this.bot.types)) {
                    if (type === OWNER) continue;
                    if (commands[type][0])
                        embed.addField(`**${emojiMap[type]} [${commands[type].length}]**`, commands[type].join(', '));
                }
            }
            message.channel.send(embed);
        })
    }
}