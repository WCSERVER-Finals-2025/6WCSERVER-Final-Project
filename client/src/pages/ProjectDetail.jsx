import { useState } from "react";
import { useRoute } from "wouter";
import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { ThumbsUp, ThumbsDown, Download, Calendar, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ProjectDetail({ currentUser }) {
  const [, params] = useRoute("/project/:id");
  const { toast } = useToast();
  
  const [project] = useState({
    id: params?.id,
    title: "E-Commerce Website with React and Node.js",
    author: "Alice Johnson",
    date: "March 15, 2024",
    course: "Web Development",
    description: "A comprehensive full-stack e-commerce platform featuring a modern React frontend and robust Node.js backend. The application includes user authentication, product catalog, shopping cart functionality, and secure payment processing through Stripe integration. Built with best practices in mind, including responsive design and optimized performance.",
    tags: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
    files: [
      { name: "project-documentation.pdf", size: "2.5 MB" },
      { name: "source-code.zip", size: "15.3 MB" },
    ],
    thumbsUp: 12,
    thumbsDown: 1,
    userVote: null,
  });

  const [comments, setComments] = useState([
    {
      id: 1,
      author: "Bob Smith",
      date: "2 hours ago",
      text: "Great project! The UI is really clean and user-friendly.",
    },
    {
      id: 2,
      author: "Carol White",
      date: "5 hours ago",
      text: "Impressive work on the payment integration. How did you handle security?",
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [userVote, setUserVote] = useState(null);

  const handleVote = (type) => {
    if (userVote === type) {
      setUserVote(null);
    } else {
      setUserVote(type);
    }
    console.log("Vote:", type);
    toast({
      title: type === "up" ? "Thumbs up!" : "Thumbs down!",
      description: `You ${type === "up" ? "liked" : "disliked"} this project.`,
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      setComments([
        {
          id: comments.length + 1,
          author: currentUser.name,
          date: "Just now",
          text: newComment,
        },
        ...comments,
      ]);
      setNewComment("");
      toast({
        title: "Comment added",
        description: "Your comment has been posted.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 overflow-auto">
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="flex items-start gap-4 mb-6">
              <Avatar className="h-12 w-12">
                <AvatarFallback>AJ</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2" data-testid="text-project-title">
                  {project.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {project.author}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {project.date}
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <Badge variant="secondary" className="mb-2">{project.course}</Badge>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Description</h2>
              <p className="text-foreground" data-testid="text-description">
                {project.description}
              </p>
            </div>

            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Project Files</h2>
              <div className="space-y-2">
                {project.files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-muted rounded-md"
                    data-testid={`file-${index}`}
                  >
                    <div>
                      <div className="font-medium">{file.name}</div>
                      <div className="text-sm text-muted-foreground">{file.size}</div>
                    </div>
                    <Button size="sm" variant="outline" data-testid={`button-download-${index}`}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-8 pb-8 border-b">
              <Button
                variant={userVote === "up" ? "default" : "outline"}
                onClick={() => handleVote("up")}
                data-testid="button-thumbs-up"
              >
                <ThumbsUp className="h-4 w-4 mr-2" />
                {project.thumbsUp}
              </Button>
              <Button
                variant={userVote === "down" ? "destructive" : "outline"}
                onClick={() => handleVote("down")}
                data-testid="button-thumbs-down"
              >
                <ThumbsDown className="h-4 w-4 mr-2" />
                {project.thumbsDown}
              </Button>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-4">
                Comments ({comments.length})
              </h2>

              <div className="mb-4">
                <Textarea
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                  data-testid="textarea-comment"
                />
                <Button
                  className="mt-2"
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  data-testid="button-add-comment"
                >
                  Add Comment
                </Button>
              </div>

              <div className="space-y-4">
                {comments.map((comment) => (
                  <Card key={comment.id} className="p-4" data-testid={`comment-${comment.id}`}>
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {comment.author.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold">{comment.author}</span>
                          <span className="text-sm text-muted-foreground">{comment.date}</span>
                        </div>
                        <p className="text-sm">{comment.text}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
