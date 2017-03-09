/* global ASSETS_BY_CHUNK_NAME */
import render from '../render';
import config from '../../../config';

export default () => async (ctx) => {
    const { renderProps, store } = ctx.state;
    const assets = ASSETS_BY_CHUNK_NAME || ctx.res.locals.webpackStats.toJson().assetsByChunkName;
    let mainEntry = assets[config.client.name];
    if (Array.isArray(mainEntry)) mainEntry = mainEntry[0];
    ctx.body = await render(renderProps, store, mainEntry);
};
