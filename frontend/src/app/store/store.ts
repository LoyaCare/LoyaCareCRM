import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query";
import { leadApi } from "@/entities/lead";
import { dealApi } from "@/entities/deal";
import { contactApi } from "@/entities/contact";
import { appointmentApi } from "@/entities/appointment";
import { userApi } from "@/entities/user"; 

export const store = configureStore({
  reducer: {
    [leadApi.reducerPath]: leadApi.reducer,
    [dealApi.reducerPath]: dealApi.reducer,
    [contactApi.reducerPath]: contactApi.reducer,
    [appointmentApi.reducerPath]: appointmentApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(
      leadApi.middleware,
      dealApi.middleware,
      contactApi.middleware,
      appointmentApi.middleware,
      userApi.middleware
    ),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;