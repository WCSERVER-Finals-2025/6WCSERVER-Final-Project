import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProfileProjects({ currentUser }) {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchProjects = async () => {
      try {
        const res = await fetch(`/api/projects?userId=${currentUser.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser?.id]);

  if (loading) {
    return <p>Loading your projects...</p>;
  }

  if (projects.length === 0) {
    return <p>No projects uploaded yet.</p>;
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project._id} className="p-4">
          <Link href={`/project/${project._id}`} className="block">
            <h3 className="text-lg font-bold mb-1">{project.title}</h3>
            <p className="text-sm mb-2">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags?.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          </Link>
        </Card>
      ))}
    </div>
  );
}
