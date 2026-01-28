import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./apis/auth";
import authReducer from "@/store/slices/auth"
import { projectsApi } from "./apis/projects";
import projectsReducer from "@/store/slices/projects"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        projects: projectsReducer,
        [projectsApi.reducerPath]: projectsApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware, projectsApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
