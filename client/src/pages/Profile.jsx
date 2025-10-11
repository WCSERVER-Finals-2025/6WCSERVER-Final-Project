import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Download, Trash, Edit } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Link } from "wouter";
import { isTeacher } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";

export default function Profile({ currentUser }) {
  const [myProjects, setMyProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  // Modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const { toast } = useToast();
  const [resume, setResume] = useState(null);

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
        setMyProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
    // fetch resume info
    const fetchResume = async () => {
      try {
        const res = await fetch(`/api/users/${currentUser.id}/resume`, { credentials: "include" });
        if (!res.ok) return;
        const data = await res.json();
        setResume(data);
      } catch (err) {
        console.warn("Could not fetch resume info", err);
      }
    };
    fetchResume();
  }, [currentUser?.id]);

  const handleDelete = async (projectId) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const text = await res.text(); // read the raw response
      try {
        const data = JSON.parse(text);
        if (!res.ok) throw new Error(data.message || "Delete failed");
        setMyProjects((prev) => prev.filter((p) => p._id !== projectId));
        alert("Project deleted successfully");
      } catch (err) {
        console.error("Delete parse error:", text);
        alert("Delete failed: " + err.message);
      }
      if (!res.ok) throw new Error(data.message || "Delete failed");

      setMyProjects((prev) => prev.filter((p) => p._id !== projectId));
      alert("Project deleted successfully");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Opens modal with project data
  const handleEdit = (project) => {
    setEditProject({ ...project });
    setIsEditing(true);
  };

  // Save edited project (PATCH request)
  const handleSaveEdit = async () => {
  if (!editProject?._id) return;

  try {
    const res = await fetch(`/api/projects/${editProject._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: editProject.title,
        description: editProject.description,
        course: editProject.course,
        tags: editProject.tags || [],
      }),
    });

    const text = await res.text(); // get raw text in case it's HTML
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("Invalid JSON in update response:", text);
      alert("Error: server did not return valid JSON");
      return;
    }

    if (!res.ok) throw new Error(data.message || "Update failed");

    // ✅ update UI with the new project data
    setMyProjects((prev) =>
      prev.map((p) => (p._id === editProject._id ? data.project : p))
    );

    alert("Project updated successfully");
    setIsEditing(false);
  } catch (err) {
    console.error("Error saving edit:", err);
    alert(err.message);
  }
};

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
                {isTeacher(currentUser) ? "Teacher" : "Student"}
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
                <input
                  id="resume-input"
                  type="file"
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const form = new FormData();
                    form.append("resume", file);
                    try {
                      const res = await fetch(`/api/users/${currentUser.id}/resume`, {
                        method: "POST",
                        body: form,
                        credentials: "include",
                      });
                      if (!res.ok) throw new Error("Upload failed");
                      const data = await res.json();
                      toast({ title: "Resume uploaded" });
                      setResume(data.resume);
                    } catch (err) {
                      console.error(err);
                      toast({ title: "Upload failed", variant: "destructive" });
                    }
                  }}
                />

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => document.getElementById("resume-input").click()}>
                    Upload Resume
                  </Button>

                  <Button variant="outline" onClick={() => {
                    if (!resume?.path) return toast({ title: "No resume", description: "No resume uploaded" });
                    // reuse ProjectDetail download pattern
                    const backendOrigin = (window.__env__ && window.__env__.BACKEND_URL) || window.location.origin;
                    const url = resume.path.startsWith("http") ? resume.path : `${backendOrigin}${resume.path}`;
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = resume.name || "resume";
                    document.body.appendChild(a);
                    a.click();
                    a.remove();
                  }}>
                    <Download className="h-4 w-4 mr-2" />
                    {resume ? "Download Resume" : "No Resume"}
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* PROJECTS */}
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
                      <Card key={project._id} className="p-4 hover:bg-muted/50 transition">
                        <div className="flex justify-between items-start">
                          <Link href={`/project/${project._id}`} className="block flex-1">
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

                          {project.uploadedBy?._id === currentUser.id && (
                            <div className="flex flex-col ml-4 gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEdit(project)}
                              >
                                <Edit className="h-4 w-4 mr-1" /> Edit
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(project._id)}
                              >
                                <Trash className="h-4 w-4 mr-1" /> Delete
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>

      {/* EDIT PROJECT MODAL */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>

          {editProject && (
            <div className="space-y-4">
              <Input
                label="Title"
                value={editProject.title}
                onChange={(e) =>
                  setEditProject({ ...editProject, title: e.target.value })
                }
                placeholder="Enter project title"
              />

              <Textarea
                label="Description"
                value={editProject.description}
                onChange={(e) =>
                  setEditProject({ ...editProject, description: e.target.value })
                }
                placeholder="Describe your project..."
              />

              <Input
                label="Course"
                value={editProject.course}
                onChange={(e) =>
                  setEditProject({ ...editProject, course: e.target.value })
                }
                placeholder="Enter course name"
              />

              <div>
                <label className="text-sm font-medium mb-2 block">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editProject.tags?.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="flex items-center gap-1 cursor-pointer hover:bg-muted"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() =>
                          setEditProject({
                            ...editProject,
                            tags: editProject.tags.filter((_, i) => i !== index),
                          })
                        }
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add new tag..."
                    value={editProject.newTag || ""}
                    onChange={(e) =>
                      setEditProject({ ...editProject, newTag: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && editProject.newTag.trim()) {
                        e.preventDefault();
                        const newTag = editProject.newTag.trim();
                        if (!editProject.tags.includes(newTag)) {
                          setEditProject({
                            ...editProject,
                            tags: [...(editProject.tags || []), newTag],
                            newTag: "",
                          });
                        }
                      }
                    }}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={() => {
                      const newTag = editProject.newTag?.trim();
                      if (newTag && !editProject.tags.includes(newTag)) {
                        setEditProject({
                          ...editProject,
                          tags: [...(editProject.tags || []), newTag],
                          newTag: "",
                        });
                      }
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
