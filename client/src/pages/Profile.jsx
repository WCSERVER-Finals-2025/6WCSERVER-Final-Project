import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectCard from "@/components/ProjectCard";
import { Download } from "lucide-react";

export default function Profile({ currentUser }) {
  const [myProjects] = useState([
    {
      id: 1,
      title: "Personal Portfolio Website",
      author: currentUser?.name || "You",
      date: "1 week ago",
      description: "My personal portfolio showcasing my projects and skills",
      tags: ["React", "Tailwind", "Web"],
      thumbsUp: 5,
      thumbsDown: 0,
      commentsCount: 2,
      status: "approved"
    },
    {
      id: 2,
      title: "Chat Application",
      author: currentUser?.name || "You",
      date: "2 days ago",
      description: "Real-time chat app with WebSocket support",
      tags: ["Node.js", "Socket.io", "Web"],
      thumbsUp: 3,
      thumbsDown: 0,
      commentsCount: 1,
      status: "pending"
    },
    {
      id: 3,
      title: "Recipe Finder App",
      author: currentUser?.name || "You",
      date: "3 days ago",
      description: "Search and save your favorite recipes",
      tags: ["React", "API", "Web"],
      thumbsUp: 0,
      thumbsDown: 1,
      commentsCount: 0,
      status: "rejected"
    },
  ]);

  const approvedProjects = myProjects.filter(p => p.status === "approved");
  const pendingProjects = myProjects.filter(p => p.status === "pending");
  const rejectedProjects = myProjects.filter(p => p.status === "rejected");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto">
          <Card className="p-8 mb-6">
            <div className="flex items-start gap-6">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="text-4xl">
                  {currentUser?.name?.split(" ").map(n => n[0]).join("") || "U"}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-profile-name">
                  {currentUser?.name}
                </h1>
                <Badge variant="secondary" className="mb-4">
                  {currentUser?.role === "teacher" ? "Teacher" : "Student"}
                </Badge>

                <div className="grid grid-cols-3 gap-6 mt-6">
                  <div>
                    <div className="text-3xl font-bold" data-testid="text-total-projects">
                      {myProjects.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Projects</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" data-testid="text-approved-count">
                      {approvedProjects.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold" data-testid="text-total-likes">
                      {myProjects.reduce((sum, p) => sum + (p.thumbsUp || 0), 0)}
                    </div>
                    <div className="text-sm text-muted-foreground">Total Likes</div>
                  </div>
                </div>

                <div className="mt-6">
                  <Button variant="outline" data-testid="button-download-resume">
                    <Download className="h-4 w-4 mr-2" />
                    Download Resume
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({myProjects.length})
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                Approved ({approvedProjects.length})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({pendingProjects.length})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({rejectedProjects.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6 space-y-4">
              {myProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </TabsContent>

            <TabsContent value="approved" className="mt-6 space-y-4">
              {approvedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </TabsContent>

            <TabsContent value="pending" className="mt-6 space-y-4">
              {pendingProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="mt-6 space-y-4">
              {rejectedProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
