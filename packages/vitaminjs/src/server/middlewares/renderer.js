/* global ASSETS_BY_CHUNK_NAME */
import render from '../render';

export default () => async (ctx) => {
    const { renderProps, store } = ctx.state;
    let mainEntry =
        (ASSETS_BY_CHUNK_NAME || ctx.res.locals.webpackStats.toJson().assetsByChunkName).main;
    mainEntry = Array.isArray(mainEntry) ? mainEntry[0] : mainEntry;
    ctx.body = await render(renderProps, store, mainEntry);
};
