import withSideEffect from 'react-side-effect';
import { PropTypes, Children } from 'react';

const propTypes = {
    status: (props, propName, componentName) => {
        const value = props[propName];
        if (!/^[1-5][\d]{2}$/.test(`${value}`)) {
            return new Error(
                `Invalid prop \`${propName}\` supplied to \`${componentName
                    }\`. Expected a valid HTTP status code (1xx to 5xx). Got ${value}`,
            );
        }
        return null;
    },
    children: PropTypes.element,
};

const reducePropsToState = (propsList) => {
    const innermostProps = propsList[propsList.length - 1];
    if (!innermostProps) {
        return 200;
    }
    return parseInt(innermostProps.status, 10);
};

const HTTPStatus = (IS_SERVER ?
    withSideEffect(reducePropsToState, () => {}) :
    x => x
)(({ children }) => (children ? Children.only(children) : null));

HTTPStatus.propTypes = propTypes;
export default HTTPStatus;
