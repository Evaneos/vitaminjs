import AsyncProps, { loadPropsOnServer } from 'async-props';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';

import config from '../../config';
import AppContainer from './components/AppContainer';
import App from '../shared/components/App';

export const renderLayout = ({ children, ...props }) =>
    `${Layout.doctype ? `${Layout.doctype}\n` : ''}${
    renderToStaticMarkup(
        <Layout {...props}>
            <div id={config.rootElementId}>
                {children}
            </div>
        </Layout>,
    )}`
;

// Return a promise that resolves to the HTML string
export default (renderProps, store, mainEntry) => {
    const css = [];
    const insertCss = styles => css.push(styles._getCss());
    return new Promise((resolve, reject) => loadPropsOnServer(
        renderProps,
        { dispatch: store.dispatch },
        (error, asyncProps) => {
            if (error) {
                return reject(error);
            }
            try {
                return resolve(renderLayout({
                    children:
                        <AppContainer
                            initialState={store.getState()}
                            mainEntry={mainEntry}
                        >
                            {renderToString(
                                <App store={store} insertCss={insertCss}>
                                    <AsyncProps {...renderProps} {...asyncProps} />
                                </App>,
                            )}
                        </AppContainer>,
                    style: css.join(''),
                    head: Helmet.rewind(),
                }));
            } catch (err) {
                return reject(err);
            }
        },
    ));
};
