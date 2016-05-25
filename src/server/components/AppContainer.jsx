import { PropTypes } from 'react';
import { stringify as stateStringifier } from '__app_modules__redux_state_serializer__';
import jsStringEscape from 'js-string-escape';
import config from '../../../config';

const propTypes = {
    script: PropTypes.object.isRequired,
    initialState: PropTypes.object,
    children: PropTypes.string.isRequired,
};

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
                src={`${config.server.externalUrl
                            + config.server.basePath
                            + config.build.client.publicPath}/${
                            config.build.client.filename}`}
            /> : null}
    </div>);
}

AppContainer.propTypes = propTypes;
export default AppContainer;
