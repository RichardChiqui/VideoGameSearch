import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface HeaderFilter{
    value:string;
    discoverSubFilter?:string;
}

const initialState: HeaderFilter = {
    value:"Discover",
    discoverSubFilter:"People"
}

const headerFitlerSlice = createSlice({
    name:"headerfilter",
    initialState,
    reducers:{
        changeMainFilter :(state, action: PayloadAction<string>) =>{
            state.value = action.payload;
        },
        changeDiscoverSubFilter:(state, action: PayloadAction<string>) =>{
            state.discoverSubFilter = action.payload;
        }
        
    }
})


export const { changeMainFilter,changeDiscoverSubFilter } = headerFitlerSlice.actions;
export default headerFitlerSlice.reducer;