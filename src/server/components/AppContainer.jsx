import { PropTypes } from 'react';
import jsStringEscape from 'js-string-escape';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';
import config from '../../../config';

const propTypes = {
    script: PropTypes.object.isRequired,
    initialState: PropTypes.object,
    children: PropTypes.string.isRequired,
};

const buildSourceUrl = () =>
    `${config.server.externalUrl
        + config.server.basePath
        + config.build.client.publicPath}/${
        /* global __VITAMIN__CLIENT_BUNDLE_VERSION__ */
        config.build.client.filename.replace(/\[hash\]/,
            module.hot ? 'hot' : __VITAMIN__CLIENT_BUNDLE_VERSION__
        )}`
;

/* eslint-disable react/no-danger */
function AppContainer({ script, initialState, children }) {
    return (<div>
        <div
            id={config.rootElementId}
            dangerouslySetInnerHTML={{ __html: children }}
        />
        {initialState ?
            <script
                dangerouslySetInnerHTML={{
                    __html: `window.__INITIAL_STATE__ = "${
                        jsStringEscape(stateStringifier(initialState))
                    }"`,
                }}
            /> : null}
        {script.toComponent()}
        {initialState ?
            <script
                async
                src={buildSourceUrl()}
            /> : null}
    </div>);
}

AppContainer.propTypes = propTypes;
export default AppContainer;
