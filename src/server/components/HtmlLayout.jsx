import { stringify as stateStringifier } from '__app_modules__redux_state_serializer__';
import { PropTypes } from 'react';
import jsStringEscape from 'js-string-escape';
import config from '../../../config';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import AsyncProps from 'async-props';
import Helmet from 'react-helmet';
import App from '../../shared/components/App';


const propTypes = {
    store: PropTypes.object.isRequired,
};

const HtmlLayout = ({ store, ...others }) => {
    const css = [];
    const insertCss = (styles) => css.push(styles._getCss());

    const app = <App store={store} insertCss={insertCss}>
        <AsyncProps {...others} />
    </App>;

    const appHtmlString = renderToString(app);
    const head = Helmet.rewind();
    return (
        <html>
            <head>
                {head.title.toComponent()}
                {head.meta.toComponent()}
                {head.link.toComponent()}
                {head.base.toComponent()}
                <style>{css.join('')}</style>
            </head>
            <body>
                <div
                    id={config.rootElementId}
                    dangerouslySetInnerHTML={{
                        __html: appHtmlString,
                    }}
                />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `window.__INITIAL_STATE__ = "${
                            jsStringEscape(stateStringifier(store.getState()))}"`,
                    }}
                />
                {head.script.toComponent()}
                <script
                    async
                    src={`${config.server.externalUrl
                    + config.server.basePath
                    + config.build.client.publicPath}/${
                    config.build.client.filename}`}
                />
            </body>
        </html>
    );
};

HtmlLayout.propTypes = propTypes;
export default HtmlLayout;
