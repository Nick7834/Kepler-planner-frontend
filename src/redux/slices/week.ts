// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import instance from "@/service";

// // all task week 

// export const taskWeek = createAsyncThunk('/weekDays', async () => {
//     const { data } = await instance.get('/weekdays');
//     return data;
//   });


// const initialState = { 
//     week: {
//         items: [] as any[],
//         status: 'loading',
//     },
// }

// const weekSlice = createSlice({
//     name: 'week',
//     initialState,
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(taskWeek.pending, (state) => {
//                 state.week.items = [];
//                 state.week.status = 'loading';
//             })
//             .addCase(taskWeek.fulfilled, (state, action) => {
//                 state.week.items = action.payload;
//                 state.week.status = 'loaded';
//             })
//             .addCase(taskWeek.rejected, (state) => {
//                 state.week.items = [];
//                 state.week.status = 'error';
//             })
//     },
// });

// export const weekReducer = weekSlice.reducer;
