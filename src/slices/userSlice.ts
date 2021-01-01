import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { auth, facebookProvider, googleProvider } from '../services/firebase';

export interface UserState {
	name: string | null;
	email: string | null;
	isLoggedIn: boolean;
	showLoginModal: boolean;
}

// interface LoginPayload {
// 	name: string;
// 	email: string;
// }

const initialState: UserState = {
	name: null,
	email: null,
	isLoggedIn: false,
	showLoginModal: true,
};

export const loginUser = createAsyncThunk('user/login', async (provider: 'google' | 'facebook') => {
	const response = await auth.signInWithPopup(provider === 'google' ? googleProvider : facebookProvider);
	if (response.user) {
		const { displayName: name, email } = response.user;
		return { name, email };
	}
	return { name: null, email: null };
});

const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		logOut: (state) => {
			state.name = null;
			state.email = null;
			state.isLoggedIn = false;
		},
		openLoginModal: (state) => {
			state.showLoginModal = true;
		},
		hideLoginModal: (state) => {
			state.showLoginModal = false;
		},
	},
	extraReducers: (builder) => {
		builder.addCase(loginUser.fulfilled, (state, action) => {
			const { name, email } = action.payload;
			state.name = name;
			state.email = email;
			state.isLoggedIn = true;
			state.showLoginModal = false;
		});
	},
});

export const { logOut, openLoginModal, hideLoginModal } = userSlice.actions;
export default userSlice.reducer;