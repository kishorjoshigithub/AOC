// redux/store.js

import { createStore, combineReducers } from 'redux';
import reducers from './Reducers/reducers';

// Define your reducers and import them here

const rootReducer = combineReducers({
  user: reducers,
});

const store = createStore(rootReducer);

export default store;
