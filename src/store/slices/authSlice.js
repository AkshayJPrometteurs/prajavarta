import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axiosInstance from '@/lib/axios'
import Cookies from 'js-cookie'
import { AUTH_COOKIE_NAME, ADMIN_AUTH_COOKIE_NAME, AUTHOR_AUTH_COOKIE_NAME } from '@/lib/auth-cookie'

const authCookieOptions = {
	expires: 7,
	sameSite: 'strict',
	secure: process.env.NODE_ENV === 'production',
}

// Async thunks
export const loginUser = createAsyncThunk(
	'auth/login',
	async ({ email, password }, { rejectWithValue }) => {
		try {
			const result = await axiosInstance.post('/auth/login', { email, password })
			Cookies.set(AUTH_COOKIE_NAME, result.data.token, authCookieOptions)
			if (result.status === 200) {
				return result.data
			}
			return rejectWithValue(result.data?.error || 'Login failed')
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Login failed')
		}
	}
)

export const adminLoginUser = createAsyncThunk(
	'auth/adminLogin',
	async ({ email, password, type }, { rejectWithValue }) => {
		try {
			const endpoint = type === 'author' ? '/author/auth/login' : '/admin/auth/login'
			const result = await axiosInstance.post(endpoint, { email, password })
			const cookieName = type === 'author' ? AUTHOR_AUTH_COOKIE_NAME : ADMIN_AUTH_COOKIE_NAME
			Cookies.set(cookieName, result.data.token, authCookieOptions)
			if (result.status === 200) {
				return result.data
			}
			return rejectWithValue(result.data?.error || 'Admin login failed')
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Admin login failed')
		}
	}
)

export const registerUser = createAsyncThunk(
	'auth/register',
	async ({ name, email, password }, { rejectWithValue }) => {
		try {
			const result = await axiosInstance.post('/auth/register', { name, email, password })
			Cookies.set(AUTH_COOKIE_NAME, result.data.token, authCookieOptions)
			if (result.status === 200) {
				return result.data
			}
			return rejectWithValue(result.data?.error || 'Registration failed')
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Registration failed')
		}
	}
)

export const checkAuth = createAsyncThunk(
	'auth/checkAuth',
	async (_, { rejectWithValue }) => {
		try {
			const result = await axiosInstance.get('/auth/profile')
			if (result.status === 200) {
				return result.data.user
			}
			return rejectWithValue('Not authenticated')
		} catch (error) {
			return rejectWithValue(error.response?.data?.error || 'Auth check failed')
		}
	}
)

export const checkAuthAuthor = createAsyncThunk(
	'auth/checkAuthAuthor',
	async (_, { rejectWithValue }) => {
		try {
			const result = await axiosInstance.get('/author/auth/profile')
			if (result.status === 200) {
				return result.data.user
			}
			return rejectWithValue('Not authenticated')
		} catch (error) {
			Cookies.remove(AUTHOR_AUTH_COOKIE_NAME)
			return rejectWithValue(error.response?.data?.error || 'Auth check failed')
		}
	}
)

export const checkAuthAdmin = createAsyncThunk(
	'auth/checkAuthAdmin',
	async (_, { rejectWithValue }) => {
		try {
			const result = await axiosInstance.get('/admin/auth/profile')
			if (result.status === 200) {
				return result.data.user
			}
			return rejectWithValue('Not authenticated')
		} catch (error) {
			Cookies.remove(ADMIN_AUTH_COOKIE_NAME)
			return rejectWithValue(error.response?.data?.error || 'Auth check failed')
		}
	}
)

export const logoutUser = createAsyncThunk(
	'auth/logout',
	async (_, { rejectWithValue }) => {
		try {
			await axiosInstance.post('/auth/logout')
			Cookies.remove(AUTH_COOKIE_NAME)
			Cookies.remove(ADMIN_AUTH_COOKIE_NAME)
		} catch (error) {
			return rejectWithValue('Logout failed')
		}
	}
)

export const logoutAdmin = createAsyncThunk(
	'auth/logoutAdmin',
	async (_, { rejectWithValue }) => {
		try {
			await axiosInstance.post('/auth/logout')
			Cookies.remove(ADMIN_AUTH_COOKIE_NAME)
		} catch (error) {
			return rejectWithValue('Admin logout failed')
		}
	}
)

// Auth slice
const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		token: null,
		loading: false,
		error: null,
		isAuthenticated: false,
		initialized: false
	},
	reducers: {
		clearError: (state) => {
			state.error = null
		},
		setInitialized: (state) => {
			state.initialized = true
		}
	},
	extraReducers: (builder) => {
		// Login
		builder
			.addCase(loginUser.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
			})
			.addCase(loginUser.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

		// Register
		builder
			.addCase(registerUser.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(registerUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
			})
			.addCase(registerUser.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

		// Admin Login
		builder
			.addCase(adminLoginUser.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(adminLoginUser.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload.user
				state.token = action.payload.token
				state.isAuthenticated = true
				state.error = null
			})
			.addCase(adminLoginUser.rejected, (state, action) => {
				state.loading = false
				state.error = action.payload
			})

		// Check Auth
		builder
			.addCase(checkAuth.pending, (state) => {
				state.loading = true
			})
			.addCase(checkAuth.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
				state.isAuthenticated = true
				state.initialized = true
			})
			.addCase(checkAuth.rejected, (state) => {
				state.loading = false
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.initialized = true
			})

		// Check Admin Auth
		builder
			.addCase(checkAuthAdmin.pending, (state) => {
				state.loading = true
			})
			.addCase(checkAuthAdmin.fulfilled, (state, action) => {
				state.loading = false
				state.user = action.payload
				state.isAuthenticated = true
				state.initialized = true
			})
			.addCase(checkAuthAdmin.rejected, (state) => {
				state.loading = false
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.initialized = true
			})

		// Logout
		builder
			.addCase(logoutUser.fulfilled, (state) => {
				state.user = null
				state.token = null
				state.isAuthenticated = false
				state.error = null
			})
	}
})

export const { clearError, setInitialized } = authSlice.actions
export default authSlice.reducer
