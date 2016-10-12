import render from '../render';

export default () => function* rendererMiddleware() {
    const { renderProps, store } = this.state;
    const mainEntry =
        // eslint-disable-next-line no-undef
        (ASSETS_BY_CHUNK_NAME || this.res.locals.webpackStats.toJson().assetsByChunkName).main;
    this.body =
        yield render(renderProps, store, Array.isArray(mainEntry) ? mainEntry[0] : mainEntry);
};
