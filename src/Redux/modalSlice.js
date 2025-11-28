import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loginModal: false,
  registerModal: false,
  verifyModal: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    isLoginModal: (state, action) => {
      state.loginModal = action.payload;
    },
    isRegisterModal: (state, action) => {
      state.registerModal = action.payload;
    },
    isVerifyModal: (state, action) => {
      state.verifyModal = action.payload;
    },
  },
});

export const { isLoginModal, isRegisterModal, isVerifyModal } = modalSlice.actions;
export default modalSlice.reducer;