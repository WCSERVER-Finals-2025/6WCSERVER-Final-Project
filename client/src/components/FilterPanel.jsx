import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProjectCard from "@/components/ProjectCard";

export default function BrowseProjects({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]); // default empty

  // --- Fetch projects dynamically ---
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects", { credentials: "include" });
        const data = await res.json();

        // Only show approved projects or user's own pending projects
        const visibleProjects = data.filter(
          (p) =>
            p.status === "approved" ||
            p.uploadedBy?._id === currentUser.id ||
            currentUser.role === "admin"
        );

        setProjects(visibleProjects);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    if (currentUser?.id) fetchProjects();
  }, [currentUser]);

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSelectedCourse(null);
    setSelectedTags([]);
    setSearchQuery("");
  };

  // --- Case-insensitive filter ---
  const filteredProjects = (projects || []).filter((p) => {
    const title = p.title?.toLowerCase() || "";
    const author = p.author?.toLowerCase() || "";
    const tags = p.tags?.map((t) => t.toLowerCase()) || [];
    const course = p.course?.toLowerCase() || "";

    const matchesSearch =
      !searchQuery ||
      title.includes(searchQuery.toLowerCase()) ||
      author.includes(searchQuery.toLowerCase()) ||
      tags.some((tag) => tag.includes(searchQuery.toLowerCase()));

    const matchesCourse =
      !selectedCourse || course === selectedCourse.toLowerCase();

    const matchesTags =
      selectedTags.length === 0 ||
      tags.some((tag) =>
        selectedTags.map((t) => t.toLowerCase()).includes(tag)
      );

    return matchesSearch && matchesCourse && matchesTags;
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Browse Projects</h1>

          <div className="mb-6">
            <SearchBar
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search projects by title, author, or tags..."
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
            <FilterPanel
              selectedCourse={selectedCourse}
              selectedTags={selectedTags}
              onCourseChange={setSelectedCourse}
              onTagToggle={handleTagToggle}
              onClearFilters={handleClearFilters}
            />

            <div className="space-y-4">
              {filteredProjects.length === 0 && (
                <p className="text-muted-foreground">No projects found.</p>
              )}

              {filteredProjects.map((project) => (
                <ProjectCard
                  key={project._id || project.id}
                  project={project}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
