import { configureStore } from '@reduxjs/toolkit'
import homeSlice from './homeSlice'
import CartSlice from './CartSlice'
const store = configureStore({
    reducer: {
        homeSlice,
        CartSlice
    },
    devTools: true,
})

export default store;