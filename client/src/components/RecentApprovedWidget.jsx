import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { FileText } from "lucide-react";

export default function RecentApprovedWidget({ projects = [] }) {
  return (
    <Card className="p-6" data-testid="card-recent-approved">
      <h3 className="text-lg font-semibold mb-4">Recent Approved Repositories</h3>
      <div className="space-y-3">
        {projects.length === 0 ? (
          <p className="text-sm text-muted-foreground" data-testid="text-no-projects">
            No approved projects yet
          </p>
        ) : (
          projects.map((project) => (
            <Link key={project.id} href={`/project/${project.id}`}>
              <div
                className="flex items-start gap-3 p-2 rounded-md hover-elevate cursor-pointer"
                data-testid={`item-project-${project.id}`}
              >
                <div className="flex-shrink-0 h-10 w-10 bg-muted rounded flex items-center justify-center">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{project.title}</h4>
                  <p className="text-xs text-muted-foreground">
                    by {project.author}
                  </p>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </Card>
  );
}
