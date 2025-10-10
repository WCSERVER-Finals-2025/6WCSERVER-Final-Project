// ProjectCard.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

export default function ProjectCard({ project }) {
  // Fallbacks in case some data is missing
  const title = project.title || "Untitled Project";
  const description = project.description || "No description provided.";
  const tags = project.tags || [];
  const status = project.status || "pending";

  // Badge color based on status
  const statusVariant = {
    approved: "secondary",
    pending: "warning",
    rejected: "destructive",
  };

  return (
    <Card className="p-4 hover:bg-muted/50 transition">
      <Link href={`/project/${project._id || project.id}`} className="block">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <Badge variant={statusVariant[status]}>{status.toUpperCase()}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-2">{description}</p>

        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </Link>
    </Card>
  );
}
