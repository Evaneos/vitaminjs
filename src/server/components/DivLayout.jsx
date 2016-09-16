import { PropTypes } from 'react';
import AppContainer from './AppContainer';

const propTypes = {
    appHtmlString: PropTypes.string.isRequired,
    initialState: PropTypes.object,
    head: PropTypes.object.isRequired,
    style: PropTypes.string.isRequired,
    entryPaths: PropTypes.objectOf(PropTypes.string).isRequired,
};

const DivLayout = ({ appHtmlString, initialState, head, style, entryPaths }) =>
    <div>
        <style>{style}</style>
        <AppContainer script={head.script} initialState={initialState} entryPaths={entryPaths} >
            {appHtmlString}
        </AppContainer>
    </div>
;

DivLayout.propTypes = propTypes;
export default DivLayout;
