import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    leaves: []
}

const leaveActionSlice = createSlice({
    name: "leaveAction",
    initialState,
    reducers: {
        setLeave: (state, action) => {
            state.leaves = action.payload;
        },
        clearLeave: (state, action) => {
            state.leaves = state.leaves.filter(l => l._id !== action.payload);
        }
    }
});

export const { setLeave, clearLeave } = leaveActionSlice.actions;
export default leaveActionSlice.reducer;