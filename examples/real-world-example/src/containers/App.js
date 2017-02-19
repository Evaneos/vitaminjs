import { Component, PropTypes } from 'react';
import { connect } from 'vitaminjs/react-redux';
import { compose } from 'vitaminjs/redux';
import { browserHistory } from 'vitaminjs/react-router';
import { withStyles } from 'vitaminjs';
import Explore from '../components/Explore';
import { resetErrorMessage } from '../actions';
import s from './style.css';

class App extends Component {
    static propTypes = {
    // Injected by React Redux
        errorMessage: PropTypes.string,
        resetErrorMessage: PropTypes.func.isRequired,
        inputValue: PropTypes.string.isRequired,
    // Injected by React Router
        children: PropTypes.node,
    }

    handleDismissClick = e => {
        this.props.resetErrorMessage();
        e.preventDefault();
    }

    handleChange = nextValue => {
        browserHistory.push(`/${nextValue}`);
    }

    renderErrorMessage() {
        const { errorMessage } = this.props;
        if (!errorMessage) {
            return null;
        }

        return (
      <p className="error-message">
        <b>{errorMessage}</b>
        {' '}
        (<a href="#"
            onClick={this.handleDismissClick}>
          Dismiss
        </a>)
      </p>
        );
    }

    render() {
        const { children, inputValue } = this.props;
        return (
      <div>
        <Explore value={inputValue}
                 onChange={this.handleChange} />
        <hr />
        {this.renderErrorMessage()}
        {children}
      </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    errorMessage: state.errorMessage,
    inputValue: ownProps.location.pathname.substring(1),
});

export default compose(
  connect(mapStateToProps, { resetErrorMessage }),
  withStyles(s),
)(App);
