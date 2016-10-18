import { PropTypes } from 'react';
import jsStringEscape from 'js-string-escape';
// eslint-disable-next-line import/no-extraneous-dependencies
import { stringify as stateStringifier } from '__app_modules__redux_stateSerializer__';
import config from '../../../config';

const propTypes = {
    initialState: PropTypes.object.isRequired,
    children: PropTypes.string.isRequired,
    mainEntry: PropTypes.string.isRequired,
};

/* eslint-disable react/no-danger */
function AppContainer({ initialState, children, mainEntry }) {
    return (<div>
        <div
            dangerouslySetInnerHTML={{ __html: children }}
        />
        <script
            dangerouslySetInnerHTML={{ __html: `
                window.__INITIAL_STATE__ = "${jsStringEscape(stateStringifier(initialState))}"`,
            }}
        />
        <script async src={`${config.publicPath}/${mainEntry}`} />
    </div>);
}

AppContainer.propTypes = propTypes;
export default AppContainer;
