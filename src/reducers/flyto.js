import { createSlice } from "@reduxjs/toolkit";
const flytoSlice=createSlice({
    name:"flyto",
    initialState:{value:false},
    reducers:{
        setFlyto:(state,actions)=>{
            state.value=actions.payload;
        },
        offFlyto:(state)=>{
            state.value=false;
        }
    }
})
export const { setFlyto,offFlyto }=flytoSlice.actions;
export default flytoSlice.reducer;