import render from '../render';

export default () => function* rendererMiddleware() {
    const { renderProps, store } = this.state;
    this.body = yield render(renderProps, store);
};
