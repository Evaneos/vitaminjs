import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Resolver } from 'react-resolver';
// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';
// eslint-disable-next-line import/no-extraneous-dependencies
import rootComponent from '__app_modules__routes__';

import config from '../../config';
import AppContainer from './components/AppContainer';

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
export default (store, mainEntry, context, location) => {
    const css = [];
    const insertCss = styles => css.push(styles._getCss());
    return Promise.resolve(rootComponent)
        .then(App => Resolver.resolve(
            () =>
                <AppContainer {...{ store, mainEntry, insertCss, context, location }} >
                    {App}
                </AppContainer>,
        ))
        .then(({ Resolved, data }) => renderLayout({
            appHTMLString: renderToString(
                <div>
                    <Helmet
                        script={[{ innerHTML: `window.__REACT_RESOLVER_PAYLOAD__ = ${JSON.stringify(data)};` }]}
                    />
                    <Resolved />
                </div>),
            style: css.join(''),
            head: Helmet.rewind(),
        }));
};
