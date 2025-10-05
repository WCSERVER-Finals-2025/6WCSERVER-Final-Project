import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ThumbsUp } from "lucide-react";

export default function TopProjectsWidget({ projects = [] }) {
  return (
    <Card className="p-6" data-testid="card-top-projects">
      <h3 className="text-lg font-semibold mb-4">Top Projects</h3>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="text-no-top-projects">
            No top projects yet
          </p>
        ) : (
          projects.map((project, index) => (
            <Link key={project.id} href={`/project/${project.id}`}>
              <div
                className="flex items-center gap-3 p-2 rounded-md hover-elevate cursor-pointer"
                data-testid={`item-top-project-${project.id}`}
              >
                <div className="flex-shrink-0 w-6 text-center font-bold text-muted-foreground">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{project.title}</h4>
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span data-testid={`text-thumbs-up-${project.id}`}>{project.thumbsUp}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
