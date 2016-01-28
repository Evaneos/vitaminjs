import { Component, PropTypes } from 'react';

export default class CSSProvider extends Component {

    static propTypes = {
        insertCss: PropTypes.func.isRequired,
        children: PropTypes.element.isRequired
    };

    static childContextTypes = {
        insertCss: PropTypes.func.isRequired,
    };

    getChildContext() {
        return {
            insertCss: this.props.insertCss
        };
    }

    render() {
        return this.props.children;
    }
}