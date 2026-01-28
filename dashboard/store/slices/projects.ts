import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Project } from "@/lib/types/projects";

interface ProjectsState {
    projects: Project[];
}

const initialState: ProjectsState = {
    projects: [],
};

export const projectsSlice = createSlice({
    name: "projects",
    initialState,
    reducers: {
        setProjects: (state, action: PayloadAction<Project[]>) => {
            state.projects = action.payload;
        },
        addProject: (state, action: PayloadAction<Project>) => {
            state.projects.push(action.payload);
        },
        removeProject: (state, action: PayloadAction<string>) => {
            state.projects = state.projects.filter(p => p.$id !== action.payload);
        },
    },
});

export const { setProjects, addProject, removeProject } = projectsSlice.actions;
export default projectsSlice.reducer;
