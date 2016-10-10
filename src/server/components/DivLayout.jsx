import { PropTypes } from 'react';

const propTypes = {
    head: PropTypes.object.isRequired,
    style: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};

const DivLayout = ({ children, style, head }) =>
    <div>
        <style>{style}</style>
        {children}
        {head.script.toComponent()}
    </div>
;

DivLayout.propTypes = propTypes;
export default DivLayout;
