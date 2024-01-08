import { createSlice } from "@reduxjs/toolkit";

export const modalSlice = createSlice({
  name: "modal",
  initialState: {
    modalType: "",
    isOpen: false,
    props: {},
  },
  reducers: {
    openModal: (state, actions) => {
      const { modalType, props } = actions.payload;
      state.modalType = modalType;
      state.props = props;
      state.isOpen = true;
    },
    closeModal: (state) => {
      state.props = {};
      state.isOpen = false;
    },
  },
});

export const { openModal, closeModal } = modalSlice.actions;
export const selectModal = (state) => state.modal;

export default modalSlice.reducer;
