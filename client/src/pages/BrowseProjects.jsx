import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProjectCard from "@/components/ProjectCard";

export default function BrowseProjects({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Fetch projects dynamically from API ---
  useEffect(() => {
    if (!currentUser?.id) return;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/projects", { credentials: "include" });
        const data = await res.json();
        setProjects(data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
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

  // --- Filter projects for search, course, and tags ---
  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCourse = !selectedCourse || p.course === selectedCourse;

    const matchesTags =
      selectedTags.length === 0 || p.tags.some((tag) => selectedTags.includes(tag));

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
              {loading && <p className="text-muted-foreground">Loading projects...</p>}
              {!loading && filteredProjects.length === 0 && (
                <p className="text-muted-foreground">No projects found.</p>
              )}
              {!loading &&
                filteredProjects.map((project) => (
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
