import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProjectCard from "@/components/ProjectCard";
import { useToast } from "@/hooks/use-toast";

export default function BrowseProjects({ currentUser }) {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch projects from backend
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();
        if (selectedCourse) params.append("course", selectedCourse);
        if (selectedTags.length) params.append("tags", selectedTags.join(","));
        if (searchQuery) params.append("q", searchQuery);

        const res = await fetch(`/api/projects?${params.toString()}`, {
          credentials: "include",
        });

        if (!res.ok) throw new Error("Failed to fetch projects");

        const data = await res.json();
        setProjects(data);
      } catch (err) {
        console.error(err);
        toast({
          title: "Error",
          description: "Failed to load projects.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [selectedCourse, selectedTags, searchQuery]);

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
            <div>
              <FilterPanel
                selectedCourse={selectedCourse}
                selectedTags={selectedTags}
                onCourseChange={setSelectedCourse}
                onTagToggle={handleTagToggle}
                onClearFilters={handleClearFilters}
              />
            </div>

            <div className="space-y-4">
              {loading ? (
                <div className="text-muted-foreground">Loading projects...</div>
              ) : projects.length ? (
                projects.map((project) => (
                  <ProjectCard key={project._id} project={project} />
                ))
              ) : (
                <div className="text-muted-foreground">
                  No projects found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
