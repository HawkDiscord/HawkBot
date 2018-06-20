const path = require('path');
const Module = require('./Module');
const Command = require('./Command');
const klaw = require('klaw');

/**
 * 
 */
class CommandManager {
    constructor(client) {
        this.client = client;
        this.rethink = client.rethink;
    }

    /**
     * Calls all load functions
     */
    async loadAll() {
        this.loadCommands();
        this.loadEvents();
    }

    /**
     * Loads a single command from a give path into the client
     * @param {string} path - the path to the commandfile
     */
    async loadCommand(path) {

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
                this.client.modules[commandModule.name] = commandModule;
                this.client.info('ModuleLoader', `Loaded '${commandModule.name}' Module`);

                klaw(`${commandModule.pathToCommands}`).on('data', commandItem => {
                    const commandFile = path.parse(commandItem.path);
                    if(!commandFile.ext || commandFile.ext !== '.js')
                        return;
                    delete require.cache[require.resolve(commandItem.path)];
                    const command = new (require(commandItem.path))(this.client);
                    if(command instanceof Command) {
                        this.client.commands[command.name] = command;
                        command.aliases.forEach(alias => {
                            this.client.commands[alias] = command;
                        });
                        this.client.info('CommandLoader', `Loaded '${command.name}'(${command.aliases.length}) Command`);
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
            this.client.info('EventLoader', `Loaded '${eventFile.name}' Event`);
            delete require.cache[require.resolve(eventItem.path)];
            const event = require(eventItem.path);
            this.client.on(eventFile.name, async(...args) => event(this.client, ...args));
        });
    }
};

module.exports = CommandManager;