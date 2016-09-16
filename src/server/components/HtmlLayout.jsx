import { PropTypes } from 'react';
import AppContainer from './AppContainer';

const propTypes = {
    appHtmlString: PropTypes.string.isRequired,
    initialState: PropTypes.object,
    head: PropTypes.object.isRequired,
    style: PropTypes.string.isRequired,
};

const HtmlLayout = ({ appHtmlString, initialState, head, style }) => (
    <html lang={head.htmlAttributes.lang} {...head.htmlAttributes}>
        <head>
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
            {head.base.toComponent()}
            <style>{style}</style>
        </head>
        <body>
            <AppContainer script={head.script} initialState={initialState}>
                {appHtmlString}
            </AppContainer>
        </body>
    </html>
);

HtmlLayout.doctype = '<!doctype html>';
HtmlLayout.propTypes = propTypes;
export default HtmlLayout;
