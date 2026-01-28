"use client";

import type { Project } from "@/lib/types/projects";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useGetProjectsQuery, useAddProjectMutation } from "@/store/apis/projects";
import { setProjects, addProject as addProjectSlice } from "@/store/slices/projects";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProjectCard from "./ProjectCard";

export default function Dashboard() {
    const dispatch = useDispatch<AppDispatch>();

    const { data: apiProjects = [], isLoading, isError } = useGetProjectsQuery();
    const [addProjectApi, { isLoading: isAdding }] = useAddProjectMutation();

    const projects = useSelector((state: RootState) => state.projects.projects);

    useEffect(() => {
        if (apiProjects.length) {
            dispatch(setProjects(apiProjects));
        }
    }, [apiProjects, dispatch]);

    const handleCreateProject = async () => {
        try {
            const newProject: Project = await addProjectApi({ name: "New Project" }).unwrap();
            dispatch(addProjectSlice(newProject));
        } catch (error) {
            console.error("Failed to create project:", error);
        }
    };

    return (
        <div className="flex flex-col py-6 gap-7">
            <h1 className="text-3xl mx-5 md:mx-40">Personal Projects</h1>

            <Tabs defaultValue="projects" className="flex flex-col gap-4">
                <TabsList className="mx-5 md:mx-40">
                    <TabsTrigger value="projects">Projects</TabsTrigger>
                    <TabsTrigger value="settings">Settings</TabsTrigger>
                </TabsList>

                <TabsContent value="projects" className="pt-7 border-t">
                    <div className="mx-5 md:mx-40 flex flex-col gap-4">
                        <div className="flex">
                            <Button onClick={handleCreateProject} disabled={isAdding}>
                                <Plus /> Create project
                            </Button>
                        </div>

                        {isLoading && <p>Loading projects...</p>}
                        {isError && <p>Error loading projects.</p>}

                        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-5">
                            {projects.map((project: Project, index: number) => (
                                <ProjectCard key={index} name={project.name} />
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="settings" className="pt-7 border-t">
                    <div className="mx-5 md:mx-40">
                        <p>Settings content goes here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
