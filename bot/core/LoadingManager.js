const path = require('path');
const Module = require('../command/Module');
const Command = require('../command/Command');
const klaw = require('klaw');
const Eris = require('eris');
const fs = require('fs');

/**
 * Manager for all loading stuff
 */
class LoadingManager {
    constructor(client) {
        this.client = client;
        this.rethink = client.rethink;
    }

    /**
     * Calls all load functions
     */
    async loadAll() {
        this.client.commands = new Eris.Collection();
        this.client.modules = new Eris.Collection();
        this.client.emotes = new Eris.Collection();
        this.client.rawCommands = new Eris.Collection();
        this.client.locales = {};
        this.loadCommands();
        this.loadEvents();
        this.loadEmotes();
        this.loadLocales();
    }

    /**
     * Loads a single command from a give path into the client
     * @param {string} path - the path to the commandfile
     */
    async loadCommand(path) {
        delete require.cache[require.resolve(path)];
        let command = new (require(path))(this.client);
        if(!command)
            return;
        this.client.commands.set(command.name, command);
        command.aliases.forEach(alias => {
            this.client.commands.set(alias, command);
        });
    }

    /**
     * Loads all commands and modules into the client. The entrypoint is the bot/commands/ directory
     */
    loadCommands() {
        klaw(`${__dirname}/../commands`).on('data', moduleItem => {
            const moduleFile = path.parse(moduleItem.path);
            if (!moduleFile.ext || moduleFile.ext !== '.js')
                return;
            delete require.cache[require.resolve(moduleItem.path)];
            const commandModule = new(require(moduleItem.path))(this.client);
            if(commandModule instanceof Module) {
                commandModule.commands = [];
                this.client.modules.set(commandModule.name, commandModule);

                klaw(`${commandModule.pathToCommands}`).on('data', commandItem => {
                    const commandFile = path.parse(commandItem.path);
                    if(!commandFile.ext || commandFile.ext !== '.js')
                        return;
                    delete require.cache[require.resolve(commandItem.path)];
                    const command = new (require(commandItem.path))(this.client);
                    if(command instanceof Command) {
                        command.module = commandModule.name;
                        if(commandModule.name !== 'botowner')
                            this.client.rawCommands.set(command.name, command.name);
                        this.client.commands.set(command.name, command);
                        this.client.modules.get(commandModule.name).commands.push(command.name);
                        command.aliases.forEach(alias => {
                            this.client.commands.set(alias, command);
                        });
                    }                                                            
                });                                                                                        
            }
        });
    }

    /**
     * Loads all events from client. The entrypoint is the bot/events/ directory
     */
    loadEvents() {
        klaw(`${__dirname}/../events`).on('data' , eventItem => {
            const eventFile = path.parse(eventItem.path);
            if (!eventFile.ext || eventFile.ext !== '.js')
                return;
            delete require.cache[require.resolve(eventItem.path)];
            const event = require(eventItem.path);
            this.client.removeAllListeners(eventFile.name);
            this.client.on(eventFile.name, async(...args) => event(this.client, ...args));
        });
    }
    /**
     * Loads all emotes that are needed to create nice emotions. :)
     */
    loadEmotes() {
        this.client.emotes.set("info", ":information_source: ");
        this.client.emotes.set("warning", ":warning: ");
        this.client.emotes.set("point", ":white_small_square: ");
    }

    /**
     * Loads all locale files and caches them
     */
    async loadLocales() {
        await fs.readdir(`${__dirname}/../../data/locales`, (err, files) => {
            files.forEach(file => {
                let invoke = file.split('.')[0];
                this.client.locales[invoke] = JSON.parse(fs.readFileSync(`${__dirname}/../../data/locales/${file}`));
            });
        });
    }
};

module.exports = LoadingManager;