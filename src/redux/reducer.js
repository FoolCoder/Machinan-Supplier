import {createSlice, PayloadAction} from '@reduxjs/toolkit';

const initialState = {
  splash: true,
  userInfo: null,
  userType: null,
  Services: [],
  loader: false,
  token: undefined,
  supplierDashBoard:null,
  operatorDashBoard: null,
};

export const dashReducer = createSlice({
  name: 'dashReducer',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    setSplash: (state, action) => {
      state.splash = action.payload;
    },
    savetoken: (state, action) => {
      state.token = action.payload;
    },
    saddadLoader: (state, action) => {
      state.loader = action.payload;
    },
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setUserType: (state, action) => {
      state.userType = action.payload;
    },
    setServices: (state, action) => {
      state.Services = action.payload;
    },
    removeUser: (state, action) => {
      state.userInfo = null;
    },
    setSupplierDashBoard: (state, action) => {
      state.supplierDashBoard = action.payload;
    },
    setOperatorDashBoard: (state, action) => {
      state.operatorDashBoard = action.payload;
    },
  },
});

export const {
  saddadLoader,
  setUserInfo,
  setSplash,
  setServices,
  removeUser,
  setUserType,
  setOperatorDashBoard,
  setSupplierDashBoard
} = dashReducer.actions;

// Other code such as selectors can use the imported `RootState` type

export default dashReducer.reducer;
