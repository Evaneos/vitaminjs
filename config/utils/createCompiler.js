import chalk from 'chalk';
import FriendlyErrorsWebpackPlugin from 'friendly-errors-webpack-plugin';
import ProgressBar from 'progress';
import webpack from 'webpack';
import ProgressPlugin from 'webpack/lib/ProgressPlugin';

export default function createCompiler(webpackConfig, message, options) {
    const compiler = webpack(webpackConfig);
    if (process.stdout.isTTY) {
        const bar = new ProgressBar(
            `${chalk.blue(`\uD83D\uDD50  ${message}`)} :percent [:bar]`,
            { incomplete: ' ', total: 60, clear: true, stream: process.stdout },
        );
        compiler.apply(new ProgressPlugin((percentage, msg) => {
            bar.update(percentage, { msg });
        }));
        compiler.apply(new FriendlyErrorsWebpackPlugin({
            clearConsole: !!options.hot,
        }));
    }

    return compiler;
}
