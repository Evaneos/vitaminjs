import { PropTypes } from 'react';
import AppContainer from './AppContainer';

const propTypes = {
    appHtmlString: PropTypes.string.isRequired,
    initialState: PropTypes.object,
    head: PropTypes.object.isRequired,
    style: PropTypes.string.isRequired,
};

const DivLayout = ({ appHtmlString, initialState, head, style }) => (
    <div>
        <style>{style}</style>
        <AppContainer script={head.script} initialState={initialState}>
            {appHtmlString}
        </AppContainer>
    </div>
);

DivLayout.propTypes = propTypes;
export default DivLayout;
