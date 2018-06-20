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
     * Loads a single command from a give path into the client
     * @param {string} path - the path to the commandfile
     */
    async loadCommand(path) {

    }

    /**
     * Loads all commands and modules into the client. The entrypoint is the bot/commands/ directory
     */
    loadCommands() {
        klaw(`${__dirname}/../commands`).on('data', (item) => {
            const moduleFile = path.parse(item.path);
            if (!moduleFile.ext || moduleFile.ext !== '.js')
                return;
            delete require.cache[require.resolve(item.path)];    
            const commandModule = new (require(item.path))(this.client);
            if(commandModule instanceof Module) {
                this.client.modules[commandModule.name] = commandModule;
                this.client.debug('CommandLoader', `${commandModule.name}`);
            }
        });
        
        /*await fs.readdirSync(`${__dirname}/../commands`, async (err, moduleFiles) => {
            if(err) throw err;
            moduleFiles.forEach(async moduleFile => {
                await fs.stat(`${__dirname}/../commands/${moduleFile}`, async (err, moduleFileStats) => {
                    if(err) throw err;
                    if(!moduleFileStats.isFile())
                        return;
                    delete require.cache[require.resolve(`${__dirname}/../commands/${moduleFile}`)];    
                    const commandModule = new (require(`${__dirname}/../commands/${moduleFile}`))(this.client);
                    if(commandModule instanceof Module) {
                        this.client.modules[moduleFile] = commandModule;
                        await fs.readdirSync(commandModule.pathToCommands, async (err, commandFiles) => {
                            console.log('why')
                            if(err) throw err;
                            commandFiles.forEach(async commandFile => {
                                await fs.stat(`${commandModule.pathToCommands}/${commandFile}`, (err, commandFileStats) => {
                                    if(err) throw err;
                                    if(commandFileStats.isFile()) {
                                        delete require.cache[require.resolve(`${commandModule.pathToCommands}/${commandFile}`)];                                        
                                        const command = new (require(`${commandModule.pathToCommands}/${commandFile}`))(this.client);

                                        if(command instanceof Command) {
                                            this.client.commands[command.name] = command;
                                            console.log('COMMANDDINGS ' + this.client.commands);
                                            command.aliases.forEach(async alias => {
                                               this.client.hawk.commands[alias] = command;
                                                //[19:47:02] Cluster 1 | {"commands":{},"modules":{}} @Lee WTF WHY
                                            });
                                        }
                                    }
                                });
                            });
                        });
                    }
                });
            });
        });*/
    }
};

module.exports = CommandManager;