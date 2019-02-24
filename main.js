const Discord = require('discord.js');
const client = new Discord.Client();
const fs = require('fs');
const chain = require('./src/chain.js');
const memory = require('./src/memory.js');
const Group = require('./src/group.js');

var token = fs.readFileSync('appToken.config', 'utf8');
if (token === undefined || token === '') throw 'BAD TOKEN';

var ClientStatuses = {
	0: 'READY',
	1: 'CONNECTING',
	2: 'RECONNECTING',
	3: 'IDLE',
	4: 'NEARLY',
	5: 'DISCONNECTED',
};

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
	memory.load();
	console.log(`Loaded with ${memory.data.groups.length} word groups`);
});

client.on('message', msg => {
	if (msg.author.username === 'Ginny') return; //Temporary
	if (msg.content === 'status') {
		msg.reply(
			`Status: ${client.status} (${
				ClientStatuses[client.status]
			})\nUptime: ${extrapolateTimeString(client.uptime)}`
		);
		return;
	}
	if (msg.content === 'purge channel') {
		msg.channel
			.fetchMessages()
			.then(messages =>
				messages.forEach(m =>
					m
						.delete()
						.then()
						.catch()
				)
			)
			.catch();
		return;
	}
	chain.process(msg.content);
});

client.on('error', error => {
	console.log(new Date().toString() + ' Error occured:');
	console.log(`Status: ${client.status} (${ClientStatuses[client.status]})`);
	console.log(`Uptime: ${extrapolateTimeString(client.uptime)}`);
	if (error.name) console.log(`Name: ${error.name}`);
	if (error.messsage) console.log(`Message: ${error.message}`);
	if (error.stack) console.log(`Stack: ${error.stack}`);

	if (client.status === 5) client.login(token);
});

client.login(token);

setInterval(function() {
	memory.save();
}, 3 * 60 * 1000); //3 minutes

function extrapolateTimeString(ms) {
	let baseDate = new Date(0);
	let uptime = new Date(ms);

	let diff = uptime.getTime() - baseDate.getTime();
	let days = Math.floor(diff / (1000 * 60 * 60 * 24));
	diff -= days * (1000 * 60 * 60 * 24);
	let hours = Math.floor(diff / (1000 * 60 * 60));
	diff -= hours * (1000 * 60 * 60);
	let mins = Math.floor(diff / (1000 * 60));
	diff -= mins * (1000 * 60);
	let seconds = Math.floor(diff / 1000);
	diff -= seconds * 1000;
	return `${days}:${hours}:${mins}:${seconds}`;
}
