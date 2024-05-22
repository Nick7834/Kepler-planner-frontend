import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import instance from "../../service";
import { RootState } from "../store";

interface LoginParams {
  email: string;
  password: string;
}

interface RegisterParams {
  fullName: string;
  email: string;
  password: string;
}

interface UserData {
  token: string;
  backgroundImage: string;
  avatarUrl : string;
}

export const fetchAuth = createAsyncThunk<UserData, LoginParams>(
  'auth/fetchUserData',
  async (params) => {
    const { data } = await instance.post('/auth/login', params);
    return data;
  }
);

export const fetchReg = createAsyncThunk<UserData, RegisterParams>(
  'auth/fetchReg',
  async (params) => {
    const { data } = await instance.post('/auth/register', params);
    return data;
  }
);

export const fetchAuthMe = createAsyncThunk<UserData>(
  'auth/fetchAuthMe',
  async () => {
    const { data } = await instance.get('/auth/me');
    return data;
  }
);

export const updateAvatar = createAsyncThunk<string, FormData>('auth,updateAvatar', async (fileData) => {
    const {data} = await instance.patch('/upload-avatar', fileData);
    return data.avatarUrl;
})

const initialState = {
  data: null as UserData | null,
  status: 'loading',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
      logout: (state) => {
        state.data = null
      },
      setBackground: (state, action) => {
        if (state.data) {
          state.data.backgroundImage = action.payload;
        }
      }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchAuth.pending, (state) => {
                state.status = 'loading'
                state.data = null
            })
            .addCase(fetchAuth.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
            })
            .addCase(fetchAuth.rejected, (state) => {
                state.status = 'error'
                state.data = null;
            })
            .addCase(fetchAuthMe.pending, (state) => {
                state.status = 'loading'
                state.data= null
              })
              .addCase(fetchAuthMe.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
              })
              .addCase(fetchAuthMe.rejected, (state) => {
                state.status = 'error'
                state.data= null;
              })
              .addCase(fetchReg.pending, (state) => {
                state.status = 'loading'
                state.data= null
              })
              .addCase(fetchReg.fulfilled, (state, action) => {
                state.status = 'loaded'
                state.data = action.payload
              })
              .addCase(fetchReg.rejected, (state) => {
                state.status = 'error'
                state.data= null;
              })
              .addCase(updateAvatar.fulfilled, (state, action) => {
                if(state.data) {
                  state.data.avatarUrl  = action.payload;
                }
              })
    },
})  

export const isAuth = (state: RootState) => Boolean(state.auth.data);
export const authReducer = authSlice.reducer;
export const { logout } = authSlice.actions