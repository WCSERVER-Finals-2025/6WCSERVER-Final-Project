import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ThumbsUp, ThumbsDown, MessageCircle } from "lucide-react";
import { Link } from "wouter";

export default function ProjectCard({ project }) {
  const authorInitials = project.author
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  const getStatusColor = (status) => {
    if (status === "approved") return "default";
    if (status === "pending") return "secondary";
    return "destructive";
  };

  return (
    <Link href={`/project/${project.id}`}>
      <Card className="p-6 hover-elevate cursor-pointer" data-testid={`card-project-${project.id}`}>
        <div className="flex items-start gap-3 mb-4">
          <Avatar>
            <AvatarFallback>{authorInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-lg" data-testid={`text-project-title-${project.id}`}>
                {project.title}
              </h3>
              {project.status && (
                <Badge variant={getStatusColor(project.status)} data-testid={`badge-status-${project.id}`}>
                  {project.status}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              by {project.author} • {project.date}
            </p>
          </div>
        </div>

        <p className="text-sm text-foreground mb-4 line-clamp-3" data-testid={`text-description-${project.id}`}>
          {project.description}
        </p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags?.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs" data-testid={`badge-tag-${tag}`}>
              {tag}
            </Badge>
          ))}
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ThumbsUp className="h-4 w-4" />
            <span data-testid={`text-thumbs-up-count-${project.id}`}>{project.thumbsUp || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <ThumbsDown className="h-4 w-4" />
            <span data-testid={`text-thumbs-down-count-${project.id}`}>{project.thumbsDown || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span data-testid={`text-comments-count-${project.id}`}>{project.commentsCount || 0}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
