import { createSlice } from "@reduxjs/toolkit";


const positionSlice=createSlice({
    name:"position",
    initialState:{value:{lat:'23.697809',lng:'120.960518'}},
    reducers:{
        setPosition:(state,action)=>{
            state.value.lat=action.payload.lat;
            state.value.lng=action.payload.lng;
        },
        setLat:(state,action)=>{
            state.value.lat=action.payload;
        },
        setLng:(state,action)=>{
            state.value.lng=action.payload;
        },
        initPosition:(state)=>{
            state.value={lat:'23.697809',lng:'120.960518'};
        }
    }
})

export const { setLat, setLng, initPosition, setPosition }=positionSlice.actions;
export default positionSlice.reducer;