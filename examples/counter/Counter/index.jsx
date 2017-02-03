import { PropTypes } from 'react';
import { connect, compose, withStyles } from 'vitaminjs';
import s from './style.css';

const Counter = ({ value, onIncrement, onDecrement }) =>
    <div> Counter: <span className={s.value}>{value}</span> <br />
        <button className={s.button} onClick={onIncrement}> +1 </button>
        <button className={s.button} onClick={onDecrement}> -1 </button>
    </div>
;

Counter.propTypes = {
    value: PropTypes.number.isRequired,
    onIncrement: PropTypes.func.isRequired,
    onDecrement: PropTypes.func.isRequired,
};


const mapStateToProps = ({ counter }) => ({ value: counter });
const mapDispatchToProps = dispatch => ({
    onIncrement: () => dispatch({ type: 'INCREMENT' }),
    onDecrement: () => dispatch({ type: 'DECREMENT' }),
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withStyles(s),
)(Counter);
