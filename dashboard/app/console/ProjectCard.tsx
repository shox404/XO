import { Card, CardContent } from "@/components/ui/card";

interface ProjectCardProps {
    name: string;
}

export default function ProjectCard({ name }: ProjectCardProps) {
    return (
        <Card className="shadow-none h-52">
            <CardContent>
                <div className="flex-1 w-full">
                    <h2 className="text-lg font-semibold">{name}</h2>
                </div>
            </CardContent>
        </Card>
    );
}
