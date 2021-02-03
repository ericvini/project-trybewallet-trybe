import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { login } from '../actions';
// Project based-@ThiagoPederzolli-Thx :)
class Login extends React.Component {
  constructor() {
    super();

    this.state = {
      email: '',
      password: '',
      authentication: false,
    };
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange({ target }) {
    const { value } = target;
    this.setState({ email: value }, () => {
      const { email } = this.state;
      const regexEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
      const verifyEmail = email.match(regexEmail);
      if (verifyEmail) {
        this.setState({ authentication: true });
      } else {
        this.setState({ authentication: false });
      }
    });
  }

  handlePasswordChange({ target }) {
    const { value } = target;
    this.setState({ password: value });
  }

  render() {
    const { authentication, email, password } = this.state;
    const { loggingin, logged } = this.props;
    const numberCharacters = 6;

    if (logged) {
      return <Redirect to="/carteira" />;
    }
    return (
      <div>
        <input
          data-testid="email-input"
          onChange={ (event) => this.handleEmailChange(event) }
        />
        <input
          data-testid="password-input"
          onChange={ (event) => this.handlePasswordChange(event) }
        />
        <button
          disabled={ !authentication || password.length < numberCharacters }
          type="button"
          onClick={ () => loggingin(email) }
        >
          Entrar
        </button>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  loggingin: (email) => dispatch(login(email)),
});

const mapStateToProps = (state) => ({
  logged: state.user.login,
});

Login.propTypes = {
  loggingin: PropTypes.func.isRequired,
  logged: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
