const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const language = require('../../data/language')
const { prefix, color } = require("../../config.json")


module.exports = {
  name: "help",
  aliases : ['h'],
  description: "Shows all available bot commands.",
  run: async (client, message, args) => {

    const p = await client.prefix(message)
    const roleColor =
    message.guild.me.displayHexColor === "#000000"
      ? "#ffffff"
      : message.guild.me.displayHexColor;

  if (!args[0]) {
    let categories = [];

    const diremojis = {
      AntiAlt: "🧱",
      antiswear: "🎯",
      Audio: "🎶",
      backup: "🔁UPDATING",
      birthday :"🎂",
      Bot :"🤖",
      Chat: "🧤",
      customcommands: "🗄",
      Economy: "💰",
      fun: "🤣",
      Giveaway: "🎉",
      info: "ℹ",
      moderation: "⛏",
      Music: "🎵",
      Prefix: "📑",
      ranks: "🔰",
      reactionroles: "🎭",
      Utility: "⚙",
      welcomesetup: "🙌"


    }
    const ignored = ["Owner-Only", "Shooting-Game", "Tickets"]
    readdirSync("./commands/").forEach((dir) => {
      const editedName = `${diremojis[dir]}  ${dir.toUpperCase()}`
      if(ignored.includes(dir)) return;
      const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
        file.endsWith(".js")
      );

      const cmds = commands.filter((command) => {
        let file = require(`../../commands/${dir}/${command}`);

        return !file.hidden;
      }).map((command) => {
        let file = require(`../../commands/${dir}/${command}`);

        if (!file.name) return "No command name.";

        let name = file.name.replace(".js", "");

        return `\|\`${name}\`\|`;
      });

      let data = new Object();

      data = {
        name: editedName,
        value: cmds.length === 0 ? "In progress." : cmds.join(" "),
      };

      categories.push(data);
    });

    const embed = new MessageEmbed()
      .setTitle("📬 Need help? Here are all of my commands:")
      .addFields(categories)
      .setDescription(
        `Use \`${p}help\` followed by a command name to get more additional information on a command. For example: \`${p}help ban\`.\nJoin our Support Server [Here](https://discord.gg/R9r6vFCR)
         Invite me now [Here](https://discord.com/api/oauth2/authorize?client_id=853225627926003732&permissions=8&scope=bot%20applications.commands)`
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(roleColor);
    return message.channel.send(embed);
  } else {
    const command =
      client.commands.get(args[0].toLowerCase()) ||
      client.commands.find(
        (c) => c.aliases && c.aliases.includes(args[0].toLowerCase())
      );

    if (!command) {
      const embed = new MessageEmbed()
        .setTitle(`${language(message.guild, 'HANDLER_COMMAND_DOES_NOT_EXIST').replace("{prefix}", prefix)}`)
        .setColor("FF0000");
      return message.channel.send(embed);
    }

    const embed = new MessageEmbed()
      .setTitle("Command Details:")
      .addField("PREFIX:", `\`${p}\``)
      .addField(
        "Command:",
        command.name ? `\`${command.name}\`` : "No name for this command."
      )
      .addField(
        "Aliases:",
        command.aliases
          ? `\`${command.aliases.join("` `")}\``
          : "No aliases for this command."
      )
      .addField(
        "Usage:",
        command.usage
          ? `\`${p}${command.name} ${command.usage}\``
          : `\`${p}${command.name}\``
      )
      .addField(
        "Description:",
        command.description
          ? command.description
          : "No description for this command."
      )
      .setFooter(
        `Requested by ${message.author.tag}`,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTimestamp()
      .setColor(roleColor);
    return message.channel.send(embed);
  }
},
};