import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import ProfileCard from "@/components/ProfileCard";
import RecentApprovedWidget from "@/components/RecentApprovedWidget";
import TopProjectsWidget from "@/components/TopProjectsWidget";
import ProjectCard from "@/components/ProjectCard";

export default function Dashboard({ currentUser }) {
  const [feedProjects, setFeedProjects] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const res = await fetch("http://localhost:5000/api/dashboard", {
          credentials: "include",
        });
        const data = await res.json();

        setFeedProjects(data.feedProjects || []);
        setRecentProjects(data.recentProjects || []);
        setTopProjects(data.topProjects || []);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading dashboard...
      </div>
    );
  }

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
            window.location.reload();
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
                  <ProjectCard key={project._id} project={project} />
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
