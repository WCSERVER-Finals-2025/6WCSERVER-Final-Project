import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPanel({ currentUser }) {
  const { toast } = useToast();
  const [pendingProjects, setPendingProjects] = useState([
    {
      id: 1,
      title: "Machine Learning Image Classifier",
      author: "David Brown",
      date: "1 hour ago",
      course: "Machine Learning",
      description: "A CNN-based image classifier trained on custom dataset",
      tags: ["Python", "TensorFlow", "ML"],
    },
    {
      id: 2,
      title: "Mobile Fitness Tracking App",
      author: "Emma Wilson",
      date: "3 hours ago",
      course: "Mobile Development",
      description: "React Native app for tracking workouts and nutrition",
      tags: ["React Native", "Firebase", "Mobile"],
    },
    {
      id: 3,
      title: "Blockchain Voting System",
      author: "Frank Miller",
      date: "5 hours ago",
      course: "Cybersecurity",
      description: "Secure voting platform using blockchain technology",
      tags: ["Blockchain", "Solidity", "Web3"],
    },
  ]);

  const handleApprove = (projectId) => {
    console.log("Approving project:", projectId);
    setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Approved",
      description: "The project has been approved and is now public.",
    });
  };

  const handleReject = (projectId) => {
    console.log("Rejecting project:", projectId);
    setPendingProjects(prev => prev.filter(p => p.id !== projectId));
    toast({
      title: "Project Rejected",
      description: "The project has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} pendingCount={pendingProjects.length} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Pending Approvals</h1>
            <Badge variant="secondary" data-testid="badge-total-pending">
              {pendingProjects.length} Pending
            </Badge>
          </div>

          {pendingProjects.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground" data-testid="text-no-pending">
                No pending projects to review
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {pendingProjects.map((project) => (
                <Card key={project.id} className="p-6" data-testid={`card-pending-${project.id}`}>
                  <div className="flex items-start gap-4 mb-4">
                    <Avatar>
                      <AvatarFallback>
                        {project.author.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{project.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        by {project.author} • {project.date}
                      </p>
                      <Badge variant="secondary" className="mt-2">{project.course}</Badge>
                    </div>
                  </div>

                  <p className="text-foreground mb-4">{project.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApprove(project.id)}
                      className="flex-1"
                      data-testid={`button-approve-${project.id}`}
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(project.id)}
                      className="flex-1"
                      data-testid={`button-reject-${project.id}`}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
