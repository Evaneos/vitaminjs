import AsyncProps, { loadPropsOnServer } from 'async-props';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';
import jsStringEscape from 'js-string-escape';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';

import config from '../../config';
import App from '../shared/components/App';

/* eslint-disable react/no-danger */
export const renderLayout = ({ appHTMLString, ...props }) =>
    `${Layout.doctype ? `${Layout.doctype}\n` : ''}${
    renderToStaticMarkup(
        <Layout {...props}>
            <div id={config.rootElementId}>
                <div dangerouslySetInnerHTML={{ __html: appHTMLString }} />
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
                    appHTMLString: renderToString(
                        <App store={store} insertCss={insertCss}>
                            <div>
                                <AsyncProps {...renderProps} {...asyncProps} />
                                <Helmet
                                    script={[
                                        { innerHTML: `window.__INITIAL_STATE__ = "${jsStringEscape(stateStringifier(store.getState()))}"` },
                                        { src: `${config.publicPath}/${mainEntry}`, async: true },
                                    ]}
                                />
                            </div>
                        </App>,
                    ),
                    style: css.join(''),
                    head: Helmet.rewind(),
                }));
            } catch (err) {
                return reject(err);
            }
        },
    ));
};
