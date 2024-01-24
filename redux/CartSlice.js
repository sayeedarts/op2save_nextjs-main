import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from '../services/axios'

let initialState = {
    user: 0,
    products: [],
    total: 0,
    currency: "GBP"
}

export const CartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addTocart: (state, action) => {
            state.products.push({
                id: action.payload.product.id,
                quantity: action.payload.quantity,
                subtotal: action.payload.product.price,
                price: action.payload.product.price,
                name: action.payload.product.name,
                image: action.payload.product.images[0],
                details: action.payload.product.short_description
            })
        },
        updateCart: (state, action) => {
            state.products = action.payload.products
        },
        emptyCart: (state, action) => {
            state.products = []
        }
    },
    extraReducers: {

    }
})

// Action creators are generated for each case reducer function
export const {
    addTocart, updateCart, emptyCart
} = CartSlice.actions

export default CartSlice.reducer