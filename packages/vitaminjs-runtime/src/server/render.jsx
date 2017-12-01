import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import Helmet from 'react-helmet';
import { Resolver } from 'react-resolver';
// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';

import config from '__vitamin_runtime_config__';
import App from './components/App';

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
    return Resolver
        .resolve(() => <App {...{ renderProps, store, mainEntry, insertCss }} />)
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
