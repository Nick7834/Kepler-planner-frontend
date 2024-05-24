import { createSlice } from "@reduxjs/toolkit";

const initialState = { 
    pin: true,
    mousePin: false,
    openRandom: false,
    openFolder: false
};

const pinSlice = createSlice({
    name: 'pin',
    initialState,
    reducers: {
        setPin: (state, action) => {
            state.pin = action.payload;
            if (typeof window !== 'undefined') {
                localStorage.setItem('pinState', JSON.stringify({ pin: state.pin }));
            }
        },
        setMousePin: (state, action) => {
            state.mousePin = action.payload;
        },
        initializePin: (state) => {
            if (typeof window !== 'undefined') {
                const storedState = localStorage.getItem('pinState');
                if (storedState) {
                    state.pin = JSON.parse(storedState).pin;
                }
            }
        },
        setOpenRandom: (state, action) => {
            state.openRandom = action.payload;
        },
        setOpenFolder: (state, action) => {
            state.openFolder = action.payload;
        },
    }
});

export const { setPin, setMousePin, initializePin, setOpenRandom, setOpenFolder } = pinSlice.actions;
export const PinReducer = pinSlice.reducer;
