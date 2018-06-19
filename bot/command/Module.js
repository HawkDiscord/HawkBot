/**
 * Base class of every module
 * @constructor
 * @param {eris} client - the eris instance that is used in the current shard
 * @param options.name - the internal module name
 * @param options.displayName - the public module name
 * @param options.description - the module description
 * @param options.pathToCommands - the path to the associated commands
 * @author ForYaSee
 */
class Module {
    constructor(client, options) {
        this.client = client;
        this.name = options.name || 'Unknown Module';
        this.displayName = options.displayName || name;
        this.description = options.description || 'No description provided';
        this.pathToCommands = options.pathToCommands || __dirname;
    }
}

module.exports = Module;