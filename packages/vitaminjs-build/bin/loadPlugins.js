export default (program, config) => config.plugins.forEach(
    plugin => {
        const pluginCommand = require(`vitaminjs-plugin-${plugin}`).default;
        pluginCommand(program);
    }
);