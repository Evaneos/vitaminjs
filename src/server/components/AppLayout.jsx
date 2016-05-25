import { stringify as stateStringifier } from '__app_modules__redux_state_serializer__';
import { PropTypes } from 'react';
import jsStringEscape from 'js-string-escape';
import config from '../../../config';
import { renderToString } from 'react-dom/server';

const propTypes = {
    children: PropTypes.element.isRequired,
    initialState: PropTypes.object.isRequired,
    helmetHead: PropTypes.object.isRequired,
    cssString: PropTypes.string.isRequired,
};

const AppLayout = ({ children, initialState, helmetHead, cssString }) => {

    const appHtmlString = renderToString(children);
    return (
        <div>
            <style>{cssString()}</style>
            <div
                id={config.rootElementId}
                dangerouslySetInnerHtml={{
                    __html: appHtmlString,
                }}
            />
            <div id="vitamin-assets">
                <script
                    dangerouslySetInnerHtml={{
                        __html: `window.__INITIAL_STATE__ = "${
                            jsStringEscape(stateStringifier(initialState))}"`,
                    }}
                />
                {helmetHead.script.toComponent()}
                <script
                    async
                    src={`${config.server.externalUrl
                    + config.server.basePath
                    + config.build.client.publicPath}/${
                    config.build.client.filename}`}
                />
            </div>
        </div>
    );
};

AppLayout.propTypes = propTypes;
export default AppLayout;
