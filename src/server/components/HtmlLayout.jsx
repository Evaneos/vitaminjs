import { PropTypes } from 'react';

const propTypes = {
    head: PropTypes.object.isRequired,
    style: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const HtmlLayout = ({ head, style, children }) => (
    <html lang={head.htmlAttributes.lang} {...head.htmlAttributes}>
        <head>
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
            {head.base.toComponent()}
            <style>{style}</style>
        </head>
        <body>
            {children}
        </body>
        {head.script.toComponent()}
    </html>
);

HtmlLayout.doctype = '<!doctype html>';
HtmlLayout.propTypes = propTypes;
export default HtmlLayout;
