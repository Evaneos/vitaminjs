import { shallow } from 'enzyme';

import Counter from './index';

const setup = (propOverrides) => {
    const props = Object.assign({
        onDecrement: jest.fn(),
        onIncrement: jest.fn(),
        value: 0,
    }, propOverrides);

    const wrapper = shallow(<Counter {...props} />);

    return {
        props,
        wrapper,
        counterValueText: wrapper.find('.value').text(),
        firstButton: wrapper.find('.button').first(),
    };
};

jest.mock('vitaminjs/react-redux', () => ({
    connect: () => component => component,
}));

jest.mock('vitaminjs', () => ({
    withStyles: () => component => component,
}));

describe('Counter component', () => {
    it('should render the component', () => {
        const { wrapper } = setup();
        expect(wrapper).toBeDefined();
    });
    it('should print the value prop', () => {
        const { counterValueText, props: { value } } = setup({ value: 102 });
        expect(counterValueText).toBe(value.toString());
    });
    it('should call onIncrement when click on the +1 button', () => {
        const { firstButton, props: { onIncrement } } = setup();
        firstButton.simulate('click');
        expect(onIncrement).toHaveBeenCalled();
    });
});