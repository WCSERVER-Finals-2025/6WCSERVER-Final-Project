import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileCard from "@/components/ProfileCard";
import RecentApprovedWidget from "@/components/RecentApprovedWidget";
import TopProjectsWidget from "@/components/TopProjectsWidget";
import ProjectCard from "@/components/ProjectCard";

export default function Dashboard({ currentUser }) {
  const [recentProjects] = useState([
    { id: 1, title: "E-Commerce Website", author: "Alice Johnson" },
    { id: 2, title: "Weather App", author: "Bob Smith" },
    { id: 3, title: "Task Manager", author: "Carol White" },
  ]);

  const [topProjects] = useState([
    { id: 4, title: "Social Media Dashboard", thumbsUp: 45 },
    { id: 5, title: "Portfolio Website", thumbsUp: 38 },
    { id: 6, title: "Expense Tracker", thumbsUp: 32 },
  ]);

  const [feedProjects] = useState([
    {
      id: 1,
      title: "E-Commerce Website with React and Node.js",
      author: "Alice Johnson",
      date: "2 hours ago",
      description: "A full-stack e-commerce platform with shopping cart, payment integration, and user authentication. Built with React, Node.js, Express, and MongoDB.",
      tags: ["React", "Node.js", "MongoDB", "Web"],
      thumbsUp: 12,
      thumbsDown: 1,
      commentsCount: 5,
      status: "approved"
    },
    {
      id: 2,
      title: "Weather Forecasting Mobile App",
      author: "Bob Smith",
      date: "5 hours ago",
      description: "A mobile application that provides real-time weather updates using the OpenWeather API. Features include location-based forecasts and weather alerts.",
      tags: ["React Native", "API", "Mobile"],
      thumbsUp: 8,
      thumbsDown: 0,
      commentsCount: 3,
      status: "approved"
    },
  ]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentUser={currentUser}
        pendingCount={5}
        onLogout={async () => {
          try {
            await fetch("http://localhost:5000/api/logout", {
              method: "POST",
              credentials: "include",
            });
            window.location.reload(); // reloads app to show login screen
          } catch (error) {
            console.error("Logout failed:", error);
          }
        }}
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-7xl mx-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Feed</h2>
              <div className="space-y-4">
                {feedProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <ProfileCard user={currentUser} />
            <RecentApprovedWidget projects={recentProjects} />
            <TopProjectsWidget projects={topProjects} />
          </div>
        </div>
      </div>
    </div>
  );
}
