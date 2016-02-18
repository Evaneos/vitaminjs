import { Children, PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

export default class DefaultRootComponent extends PureComponent {

    static propTypes = {
        children: PropTypes.element
    };

    render() {
        return Children.only(this.props.children);
    }
}
