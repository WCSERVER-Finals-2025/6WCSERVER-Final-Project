// ProjectCard.jsx
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

// small helper to safely read nested values that may be populated or just ids
const getUploaderName = (uploadedBy) => {
  if (!uploadedBy) return "Unknown";
  if (typeof uploadedBy === "string") return uploadedBy;
  // mongoose populate usually provides { _id, name }
  return uploadedBy.name || uploadedBy.email || uploadedBy._id || "Unknown";
};

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

  const uploader = getUploaderName(project.uploadedBy);
  const created = project.createdAt ? new Date(project.createdAt).toLocaleDateString() : "";

  return (
    <Card className="p-4 hover:bg-muted/50 transition">
      <Link href={`/project/${project._id || project.id}`} className="block">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-lg font-semibold">{title}</h3>
            <div className="text-sm text-muted-foreground">by {uploader} • {created}</div>
          </div>
          <Badge variant={statusVariant[status] || "secondary"}>{String(status).toUpperCase()}</Badge>
        </div>

        <p className="text-sm text-muted-foreground mb-2">{description}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="text-sm text-muted-foreground">
            {project.files?.length ? (
              <div className="flex items-center gap-2">
                <span>{project.files.length} file{project.files.length > 1 ? 's' : ''}</span>
                {project.files.slice(0, 2).map((f, i) => (
                  <a key={i} href={f.path.startsWith('http') ? f.path : `${window.location.origin}${f.path}`} target="_blank" rel="noreferrer" className="underline ml-2">
                    {f.name}
                  </a>
                ))}
              </div>
            ) : (
              <span>No files</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
