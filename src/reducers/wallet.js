// Esse reducer será responsável por tratar o todas as informações relacionadas as despesas
import {
  NEW_EXPENSE,
  REQUEST_CURRENCIES,
  RECEIVE_CURRENCIES_SUCCESS,
  RECEIVE_CURRENCIES_FAILURE,
  EXCLUDE_EXPENSE,
} from '../actions';

const INITAL_STATE = {
  isFetching: false,
  currencies: {},
  expenses: [],
  error: '',
};

const walletReducer = (state = INITAL_STATE, action) => {
  switch (action.type) {
  case NEW_EXPENSE:
    return { ...state, expenses: [...state.expenses, action.value] };
  case REQUEST_CURRENCIES:
    return { ...state, isFetching: true };
  case RECEIVE_CURRENCIES_SUCCESS:
    return {
      ...state,
      isFetching: false,
      currencies: { ...action.currencies },
    };
  case RECEIVE_CURRENCIES_FAILURE:
    return {
      ...state,
      isFetching: false,
      error: action.err.message,
    };
  case EXCLUDE_EXPENSE:
    return { ...state,
      expenses: [...state.expenses.filter((expense) => expense.id !== action.id)] };
  default:
    return state;
  }
};

export default walletReducer;
