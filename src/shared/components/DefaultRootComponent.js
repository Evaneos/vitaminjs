import { Children, PropTypes, Component } from 'react';
export default class DefaultRootComponent extends Component {

    static propTypes = {
        children: PropTypes.element
    };

    render() {
        return Children.only(this.props.children);
    }
}
