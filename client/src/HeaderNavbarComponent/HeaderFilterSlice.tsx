import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface HeaderFilter{
    value:string;
}

const initialState: HeaderFilter = {
    value:"Title"
}

const headerFitlerSlice = createSlice({
    name:"headerfilter",
    initialState,
    reducers:{
        changeMainFilter :(state, action: PayloadAction<string>) =>{
            state.value = action.payload;

        }
        
    }
})


export const { changeMainFilter } = headerFitlerSlice.actions;
export default headerFitlerSlice.reducer;