import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    user: localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        updateCheckIn: (state) => {
            state.user.checkedIn = true;
        },
        updateCheckOut: (state) => {
            state.user.checkedOut = true;
        }
    }
});

export const { setUser, updateCheckIn, updateCheckOut } = userSlice.actions;
export default userSlice.reducer;