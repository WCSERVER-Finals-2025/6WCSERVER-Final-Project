import { useState, useEffect } from "react";
import { isStaff } from "@/lib/roles";
import Sidebar from "@/components/Sidebar";
import ProfileCard from "@/components/ProfileCard";
import RecentApprovedWidget from "@/components/RecentApprovedWidget";
import TopProjectsWidget from "@/components/TopProjectsWidget";
import ProjectCard from "@/components/ProjectCard";

export default function Dashboard({ currentUser }) {
  const [recentProjects, setRecentProjects] = useState([]);
  const [topProjects, setTopProjects] = useState([]);
  const [feedProjects, setFeedProjects] = useState([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Normal users only see approved projects
        // Admins can see all
  const statusQuery = isStaff(currentUser) ? "" : "status=approved";

        // Feed
        const feedRes = await fetch(`/api/projects?${statusQuery}`, { credentials: "include" });
        const feedData = await feedRes.json();
        setFeedProjects(feedData || []);

        // Recent approved projects (last 5)
        const recentRes = await fetch(`/api/projects?${statusQuery}&limit=5`, { credentials: "include" });
        const recentData = await recentRes.json();
        setRecentProjects(recentData || []);

        // Top projects (based on thumbsUp)
        const topRes = await fetch(`/api/projects?${statusQuery}&sort=thumbsUp`, { credentials: "include" });
        const topData = await topRes.json();
        setTopProjects(topData || []);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    fetchProjects();
  }, [currentUser?.role]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        currentUser={currentUser}
        pendingCount={0} // can dynamically fetch pending count if needed
        onLogout={async () => {
          try {
            await fetch("/api/logout", { method: "POST", credentials: "include" });
            window.location.reload();
          } catch (error) {
            console.error("Logout failed:", error);
          }
        }}
      />

      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 p-6 max-w-7xl mx-auto">
          <div className="space-y-6">
            {/* Feed */}
            <div>
              <h2 className="text-2xl font-bold mb-4">Feed</h2>
              <div className="space-y-4">
                {(feedProjects || []).map((project) => (
                  <ProjectCard key={project._id || project.id} project={project} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Widgets */}
          <div className="space-y-4">
            <ProfileCard user={currentUser} />
            <RecentApprovedWidget projects={recentProjects || []} />
            <TopProjectsWidget projects={topProjects || []} />
          </div>
        </div>
      </div>
    </div>
  );
}
