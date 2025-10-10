import { Card } from "@/components/ui/card";
import { ThumbsUp } from "lucide-react";

export default function TopProjectsWidget({ projects }) {
  return (
    <Card className="p-4">
      <h4 className="font-semibold text-lg mb-2">Top Projects</h4>
      <ul className="space-y-2">
        {projects.map((proj) => (
          <li key={proj._id} className="flex justify-between items-center text-sm">
            <span>{proj.title}</span>
            <span className="flex items-center gap-1">
              <ThumbsUp className="h-3 w-3" />
              {proj.thumbsUp || 0}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
