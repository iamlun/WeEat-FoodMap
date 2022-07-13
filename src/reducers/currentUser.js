import { createSlice } from "@reduxjs/toolkit";


const currentUserslice=createSlice({
    name:"currentUser",
    initialState:{info:{uid:'',displayName:'',email:'',photoURL:''}},
    reducers:{
        setUser:(state,action)=>{
            state.info=action.payload;
        },
        initUser:(state)=>{
            state.info={uid:'',displayName:'',email:'',photoURL:''};
        }
    }
})

export const {setUser, initUser}=currentUserslice.actions;
export default currentUserslice.reducer;