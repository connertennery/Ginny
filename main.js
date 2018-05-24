const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');

var token = fs.readFileSync('appToken.config', 'utf8');
if (token === undefined || token === '') throw 'BAD TOKEN';

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
	if (msg.content === 'ping') {
		msg.reply('pong');
	}
});

client.login(token);