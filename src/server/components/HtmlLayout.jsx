import { PropTypes } from 'react';

const HelmetHeadPropTypes = PropTypes.shape({
    toComponent: PropTypes.func.isRequired,
}).isRequired;

const propTypes = {
    head: PropTypes.shape({
        title: HelmetHeadPropTypes,
        meta: HelmetHeadPropTypes,
        link: HelmetHeadPropTypes,
        base: HelmetHeadPropTypes,
        script: HelmetHeadPropTypes,
        htmlAttributes: HelmetHeadPropTypes,
    }).isRequired,
    style: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const HtmlLayout = ({ head, style, children }) => (
    // eslint-disable-next-line jsx-a11y/html-has-lang
    <html {...head.htmlAttributes.toComponent()} >
        <head>
            {head.title.toComponent()}
            {head.meta.toComponent()}
            {head.link.toComponent()}
            {head.base.toComponent()}
            {head.script.toComponent()}
            <style dangerouslySetInnerHTML={{ __html: style }} />
        </head>
        <body>{children}</body>
    </html>
);

HtmlLayout.doctype = '<!doctype html>';
HtmlLayout.propTypes = propTypes;
export default HtmlLayout;
