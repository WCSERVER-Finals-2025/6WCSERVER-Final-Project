import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProjectCard from "@/components/ProjectCard";

export default function BrowseProjects({ currentUser }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);

  const [projects] = useState([
    {
      id: 1,
      title: "E-Commerce Website",
      author: "Alice Johnson",
      date: "2 hours ago",
      description: "A full-stack e-commerce platform with shopping cart functionality",
      tags: ["React", "Node.js", "MongoDB"],
      thumbsUp: 12,
      thumbsDown: 1,
      commentsCount: 5,
      status: "approved"
    },
    {
      id: 2,
      title: "Weather App",
      author: "Bob Smith",
      date: "5 hours ago",
      description: "Mobile weather application with real-time updates",
      tags: ["React Native", "API"],
      thumbsUp: 8,
      thumbsDown: 0,
      commentsCount: 3,
      status: "approved"
    },
    {
      id: 3,
      title: "Task Manager",
      author: "Carol White",
      date: "1 day ago",
      description: "A simple task management tool with drag-and-drop",
      tags: ["React", "UI/UX"],
      thumbsUp: 15,
      thumbsDown: 2,
      commentsCount: 7,
      status: "approved"
    },
  ]);

  const handleTagToggle = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
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
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
