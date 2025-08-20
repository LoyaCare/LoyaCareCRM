import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { dealApi } from "@/entities/deal/api";
import { leadApi } from "@/entities/lead/api";
import { contactApi } from "@/entities/contact/api";
import { userApi } from "@/entities/user/api";
import { noteApi } from "@/entities/note/api";
import { appointmentApi } from "@/entities/appointment/api";

// Configure the Redux store with the APIs

export const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
    [leadApi.reducerPath]: leadApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [noteApi.reducerPath]: noteApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dealApi.middleware)
      .concat(leadApi.middleware)
      .concat(contactApi.middleware)
      .concat(userApi.middleware)
      .concat(noteApi.middleware)
      .concat(appointmentApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;