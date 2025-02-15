import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import userReducer from './userSlice';
import leaveReducer from './leaveSlice';
import leaveActionReducer from './leaveActionSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        leave: leaveReducer,
        leaveAction: leaveActionReducer
    }
});

export default store;