import { Project } from "@/lib/types/projects";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const projectsApi = createApi({
    reducerPath: "projectsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api/projects" }),
    tagTypes: ["Project"],
    endpoints: (builder) => ({
        getProjects: builder.query<Project[], void>({
            query: () => "/",
            providesTags: ["Project"],
        }),
        addProject: builder.mutation<Project, Partial<Project>>({
            query: (newProject) => ({
                url: "/",
                method: "POST",
                body: newProject,
            }),
            invalidatesTags: ["Project"],
        }),
    }),
});

export const { useGetProjectsQuery, useAddProjectMutation } = projectsApi;
