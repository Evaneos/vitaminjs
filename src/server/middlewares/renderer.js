import { loadPropsOnServer } from 'async-props';
import render from '../render';

export default () => function* rendererMiddleware() {
    const renderProps = this.state.renderProps;
    const store = this.state.store;
    // Wrap async logic into a thenable to keep holding response until data is loaded, or not.
    yield new Promise((resolve, reject) => {
        loadPropsOnServer(
            renderProps,
            { dispatch: store.dispatch },
            (error, asyncProps) => {
                if (error) {
                    return reject(error);
                }
                try {
                    this.body = render(store, renderProps, asyncProps);
                } catch (e) {
                    return reject(e);
                }
                return resolve();
            }
        );
    });
};
