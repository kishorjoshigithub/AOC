import { createStore, applyMiddleware } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'; // Import Redux Thunk
import { combineReducers } from 'redux'; // Import combineReducers
import { authReducer, userReducer } from './Reducers/reducers'; // Adjust the import paths accordingly

// Define your reducers and import them here
const persistConfig = {
  key: 'root',
  storage, // Use 'storage' here
  whitelist: ['auth', 'user'], // Specify which reducers to persist
};

const rootReducer = combineReducers({
  auth: authReducer,
  user: userReducer,
 
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
  persistedReducer,
  applyMiddleware(thunk)
);

const persistor = persistStore(store);

export { store, persistor };
