import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const register = createAsyncThunk('auth/register', async({username, password, email}, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:7000/register', {username, password, email});
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
        }
        localStorage.setItem('username', res.data.username)
        return res.data;
    } catch (e) {
        console.log(e);
        return thunkAPI.rejectWithValue(e.message);
    }
})

export const login = createAsyncThunk('auth/login', async({username, password}, thunkAPI) => {
    try {
        const res = await axios.post('http://localhost:7000/login', {username, password});
        if (res.data.token) {
            localStorage.setItem('token', res.data.token);
            
        }
        localStorage.setItem('username', res.data.username)
        return res.data;
    } catch (e) {
        return thunkAPI.rejectWithValue(e.response.data);
    }
})

const initialState = {
    user: localStorage.getItem('username') || '',
    isLoggedIn: !!localStorage.getItem('token'),
    loading: false,
    error: null,
    token : localStorage.getItem('token') || null,
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.user = ''
            state.isLoggedIn = false
            state.loading = false
            state.error = null
            state.token = null
            localStorage.removeItem('token');
            localStorage.removeItem('username');
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.username
            state.isLoggedIn = true
            state.loading = false
            state.error = null
            state.token = action.payload.token
        })
        .addCase(register.pending, (state, action) => {
            state.loading = true
        })
        .addCase(register.rejected, (state, action) => {
            state.loading = false
            state.isLoggedIn = false
            state.error = action.payload
        })
        .addCase(login.fulfilled, (state, action) => {
            state.user = action.payload.username
            state.isLoggedIn = true
            state.loading = false
            state.error = null
            state.token = action.payload.token
        })
        .addCase(login.pending, (state, action) => {
            state.loading = true
        })
        .addCase(login.rejected, (state, action) => {
            state.loading = false
            state.isLoggedIn = false
            state.error = action.payload
        })
    }
})

export const {logout} = authSlice.actions

export default authSlice.reducer