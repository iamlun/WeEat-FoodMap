import { createSlice } from "@reduxjs/toolkit";


const mapslice=createSlice({
    name:"map",
    initialState:null,
    reducers:{
        setMap:(state,action)=>{
            state=action.payload;
        }
    }
})

export const {setMap}=mapslice.actions;
export default mapslice.reducer;