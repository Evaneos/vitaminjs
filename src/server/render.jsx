// eslint-disable-next-line import/no-extraneous-dependencies
import Layout from '__app_modules__server_layout__';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import AsyncProps from 'async-props';
import Helmet from 'react-helmet';
import App from '../shared/components/App';

export function renderLayout(props) {
    return `${Layout.doctype ? `${Layout.doctype}\n` : ''}${
        renderToStaticMarkup(<Layout {...props} />)}`;
}

export default function render(store, renderProps, asyncProps) {
    const css = [];
    const insertCss = styles => css.push(styles._getCss());

    const app = (<App store={store} insertCss={insertCss}>
        <AsyncProps {...renderProps} {...asyncProps} />
    </App>);

    return renderLayout({
        appHtmlString: renderToString(app),
        style: css.join(''),
        head: Helmet.rewind(),
        initialState: store.getState(),
    });
}
