import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "wouter";

export default function Profile({ currentUser }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/projects?userId=${currentUser.id}`, {
          credentials: "include",
        });
        if (!res.ok) throw new Error("Failed to fetch projects");
        const data = await res.json();
        setMyProjects(data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentUser?.id]);

  const filteredProjects = (status) => {
    if (status === "all") return myProjects;
    return myProjects.filter((p) => p.status === status);
  };

  const approvedProjects = filteredProjects("approved");
  const pendingProjects = filteredProjects("pending");
  const rejectedProjects = filteredProjects("rejected");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-5xl mx-auto space-y-6">
          {/* PROFILE CARD */}
          <Card className="p-8 flex items-start gap-6">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-4xl">
                {currentUser?.name?.split(" ").map((n) => n[0]).join("") || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h1 className="text-3xl font-bold">{currentUser?.name}</h1>
              <Badge variant="secondary" className="mb-4">
                {currentUser?.role === "teacher" ? "Teacher" : "Student"}
              </Badge>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <div className="text-3xl font-bold">{myProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Total Projects</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">{approvedProjects.length}</div>
                  <div className="text-sm text-muted-foreground">Approved</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">
                    {myProjects.reduce((sum, p) => sum + (p.thumbsUp || 0), 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Total Likes</div>
                </div>
              </div>

              <div className="mt-6">
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                </Button>
              </div>
            </div>
          </Card>

          {/* PROJECTS WITH TABS */}
          <div>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All ({myProjects.length})</TabsTrigger>
                <TabsTrigger value="approved">Approved ({approvedProjects.length})</TabsTrigger>
                <TabsTrigger value="pending">Pending ({pendingProjects.length})</TabsTrigger>
                <TabsTrigger value="rejected">Rejected ({rejectedProjects.length})</TabsTrigger>
              </TabsList>

              {["all", "approved", "pending", "rejected"].map((status) => (
                <TabsContent key={status} value={status} className="mt-6 space-y-4">
                  {loading && <p className="text-muted-foreground">Loading projects...</p>}
                  {!loading && filteredProjects(status).length === 0 && (
                    <p>No projects found for this category.</p>
                  )}
                  {!loading &&
                    filteredProjects(status).map((project) => (
                      <Card
                        key={project._id}
                        className="p-4 hover:bg-muted/50 transition"
                      >
                        <Link href={`/project/${project._id}`} className="block">
                          <h3 className="text-lg font-semibold">{project.title}</h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {project.description}
                          </p>
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
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
