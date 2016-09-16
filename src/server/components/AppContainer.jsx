import { PropTypes } from 'react';
import jsStringEscape from 'js-string-escape';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';
import config from '../../../config';

const propTypes = {
    script: PropTypes.object.isRequired,
    initialState: PropTypes.object,
    children: PropTypes.string.isRequired,
    entryPaths: PropTypes.shape({
        [config.build.client.filename]: PropTypes.string.isRequired,
    }).isRequired,
};

/* eslint-disable react/no-danger */
function AppContainer({ script, initialState, children, entryPaths }) {
    return (<div>
        <div
            id={config.rootElementId}
            dangerouslySetInnerHTML={{ __html: children }}
        />
        {initialState ?
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        window.__INITIAL_STATE__ = "${
                            jsStringEscape(stateStringifier(initialState))
                        }"
                        window.__ENTRY_PATHS__ = ${JSON.stringify(entryPaths)}`,
                }}
            /> : null}
        {script.toComponent()}
        {initialState ?
            <script
                async
                src={entryPaths[config.build.client.filename]}
            /> : null}
    </div>);
}

AppContainer.propTypes = propTypes;
export default AppContainer;
