module.exports.run = async (bot, message, args, con) => {
  const Discord = require("discord.js");
  const moment = require("moment");

  const ment = message.mentions.users.first();
  const member = message.guild.member(message.author);
  const mentmember = message.guild.member(ment);

  if (!ment) {
    var rlist;
    var rmap = "";

    member.roles.map(role => {
      if (role.id === message.guild.id) return;
      rmap += `<@&${role.id}>, `;
    });
    rmap = rmap.slice(0, -1);
    
    if (rmap.length > 1000) rlist = `(${member.roles.size} roles)`;
    if (rmap.length < 1) rlist = "No role.";
    else rlist = rmap;

    const nomentembed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .addField(":page_with_curl: Tag", message.author.tag, true)
      .addField(":id: ID", message.author.id, true)
      .addField(
        bot.lang.infos.userinfo.status,
        (status = bot.lang.infos.userinfo[message.author.presence.status]),
        true
      )
      .addField(
        bot.lang.infos.userinfo.createdthe,
        `${moment(message.author.createdAt).format(
          bot.lang.infos.userinfo.createddate
        )}`,
        true
      )
      .addField(
        bot.lang.infos.userinfo.game,
        `${
          message.author.presence.game
            ? message.author.presence.game.name
            : bot.lang.infos.userinfo.none
        }`,
        true
      )
      .addField(bot.lang.infos.userinfo.roles, rlist, true)
      .setThumbnail(message.author.avatarURL);
    return message.channel.send(nomentembed);
  } else if (ment) {
    let rlist;
    let rmap = "";
    mentmember.roles.map(role => {
      if (role.id === message.guild.id) return;
      rmap += `<@&${role.id}>, `;
    });
    rmap = rmap.slice(0, -1);
    if (rmap.length < 1) rlist = "No role";
    if (rmap.length > 1000) rlist = `(${mentmember.roles.size} roles)`;
    else rlist = rmap;
    const embed = new Discord.RichEmbed()
      .setColor("RANDOM")
      .addField(":page_with_curl: Tag", ment.tag, true)
      .addField(":id: ID", ment.id, true)
      .addField(
        bot.lang.infos.userinfo.status,
        bot.lang.infos.userinfo[message.author.presence.status],
        true
      )
      .addField(
        bot.lang.infos.userinfo.createdthe,
        `${moment(message.author.createdAt).format(
          bot.lang.infos.userinfo.createddate
        )}`,
        true
      )
      .addField(
        bot.lang.infos.userinfo.game,
        `${
          ment.presence.game
            ? ment.presence.game.name
            : bot.lang.infos.userinfo.none
        }`,
        true
      )
      .addField(bot.lang.infos.userinfo.roles, rlist, true)
      .setThumbnail(ment.avatarURL);
    message.channel.send(embed);
  }
};
module.exports.help = {
  name: "userinfo",
  catégorie: "Infos",
  helpcaté: "infos"
};