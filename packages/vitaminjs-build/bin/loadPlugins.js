import mergeWith from 'lodash.mergewith';
import { concat } from '../config/utils';

export default (program, config) => config.plugins.forEach(
    plugin => {
        const pluginCommand = require(`vitaminjs-plugin-${plugin}`).default;
        if (pluginCommand.command) {
            pluginCommand.command(program);
        }
    }
);

export const loadWebpackConfigPlugins = (webpackConfig, appConfig) => appConfig.plugins.reduce(
    (config, plugin) => {
        const webpackConfigPlugin = require(`vitaminjs-plugin-${plugin}`).default;

        if (!webpackConfigPlugin.webpack) {
            return config
        }

        return mergeWith({}, webpackConfig, webpackConfigPlugin.webpack, concat);
    },
    appConfig,
);
