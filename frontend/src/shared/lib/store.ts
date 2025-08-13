import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";
import { dealApi } from "@/features/deal/model/api";
import { leadApi } from "@/features/lead/model/api";

export const store = configureStore({
  reducer: {
    [dealApi.reducerPath]: dealApi.reducer,
    [leadApi.reducerPath]: leadApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(dealApi.middleware)
      .concat(leadApi.middleware),
  devTools: process.env.NODE_ENV !== "production",
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;