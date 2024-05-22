'use client'
import { configureStore } from "@reduxjs/toolkit"
import { authReducer } from "./slices/auth";
import { tasksReducer } from "./slices/tasks";
import { PinReducer } from "./slices/pin";

const store = configureStore({
     reducer: {
        auth: authReducer ,
        tasks: tasksReducer,
        pin: PinReducer
     }
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;