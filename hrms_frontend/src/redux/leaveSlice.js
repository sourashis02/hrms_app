import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    leaves: []
}

const leaveSlice = createSlice({
    name: "leave",
    initialState,
    reducers: {
        setLeave: (state, action) => {
            state.leaves = action.payload;
        },
        addLeave: (state, action) => {
            state.leaves.push(action.payload);
        }
    }
});

export const { setLeave, addLeave } = leaveSlice.actions;
export default leaveSlice.reducer;