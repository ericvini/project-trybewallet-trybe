import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchCurrencies, newExpense } from '../actions';
import Table from '../components/Table';

class Wallet extends React.Component {
  constructor() {
    super();
    this.state = {
      totalExpenses: 0,
      form: {
        id: 0,
        value: 0,
        description: '',
        currency: 'USD',
        method: 'Dinheiro',
        tag: 'Alimentação',
        exchangeRates: {},
      },
    };
    this.filterCurrencies = this.filterCurrencies.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFormState = this.updateFormState.bind(this);
  }

  componentDidMount() {
    const { getCurrencies } = this.props;
    getCurrencies();
  }

  filterCurrencies() {
    const { currencies } = this.props;
    const allcurrencies = Object.entries(currencies);
    const filteredCurrencies = allcurrencies.filter(
      (currencie) => currencie[0] !== 'USDT',
    );
    return filteredCurrencies;
  }

  handleChange({ target }) {
    const { name, value } = target;
    this.setState((previouState) => ({
      form: { ...previouState.form, [name]: value },
    }));
  }

  updateFormState() {
    const { getCurrencies, saveExpenses, currencies } = this.props;
    getCurrencies();
    this.setState(
      (previousState) => ({
        form: { ...previousState.form, exchangeRates: currencies },
      }),
      () => {
        const { form } = this.state;
        saveExpenses(form);
        this.setState((previouState) => ({
          form: {
            currency: 'USD',
            description: '',
            exchangeRates: {},
            id: previouState.form.id + 1,
            method: 'Dinheiro',
            tag: 'Alimentação',
            value: 0,
          },
        }));
      },
    );
  }

  updateTotalExpenses() {
    const exchange = this.filterCurrencies();
    const {
      form: { value, currency },
    } = this.state;
    const exchangeRate = exchange.find((currencie) => currencie[0] === currency);
    const expense = value * exchangeRate[1].ask;
    this.setState((previouState) => ({
      totalExpenses: previouState.totalExpenses + +expense.toFixed(2),
    }));
  }

  handleSubmit() {
    this.updateTotalExpenses();
    this.updateFormState();
  }

  render() {
    const { totalExpenses, form } = this.state;
    const { value, description, currency, method, tag } = form;

    const { email } = this.props;

    const filteredCurrencie = this.filterCurrencies();

    return (
      <div>
        <header>
          <p data-testid="email-field">{email}</p>
          <p data-testid="total-field">{totalExpenses}</p>
          <p data-testid="header-currency-field">BRL</p>
        </header>

        <input
          data-testid="value-input"
          name="value"
          value={ value }
          onChange={ this.handleChange }
        />
        <input
          data-testid="description-input"
          name="description"
          value={ description }
          onChange={ this.handleChange }
        />
        <select
          data-testid="currency-input"
          name="currency"
          value={ currency }
          onChange={ this.handleChange }
        >
          {filteredCurrencie.map((currencie) => (
            <option
              key={ currencie[0] }
              value={ currencie[0] }
              data-testid={ currencie[0] }
            >
              {currencie[0]}
              {' '}
            </option>
          ))}
        </select>
        <select
          data-testid="method-input"
          name="method"
          value={ method }
          onChange={ this.handleChange }
        >
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de crédito">Cartão de crédito</option>
          <option value="Cartão de débito">Cartão de débito</option>
        </select>
        <select
          data-testid="tag-input"
          name="tag"
          value={ tag }
          onChange={ this.handleChange }
        >
          <option value="Alimentação">Alimentação</option>
          <option value="Lazer">Lazer</option>
          <option value="Trabalho">Trabalho</option>
          <option value="Transporte">Transporte</option>
          <option value="Saúde">Saúde</option>
        </select>
        <button type="button" onClick={ this.handleSubmit }>
          Adicionar Despesa
        </button>
        <Table />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
});

const mapDispatchToProps = (dispatch) => ({
  getCurrencies: () => dispatch(fetchCurrencies()),
  saveExpenses: (expenses) => dispatch(newExpense(expenses)),
});

Wallet.propTypes = {
  email: PropTypes.string.isRequired,
  currencies: PropTypes.arrayOf(PropTypes.object).isRequired,
  getCurrencies: PropTypes.func.isRequired,
  saveExpenses: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Wallet);
