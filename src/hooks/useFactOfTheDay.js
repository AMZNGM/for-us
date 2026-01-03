import { useEffect, useState } from "react";
import { getPosts } from "@/lib/getPosts";
import { useLoading } from "@/components/loading-components/LoadingContext";

export function useFactOfTheDay() {
  const { addLoadingTask, removeLoadingTask } = useLoading();
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      const taskId = "fetch-fact-posts";
      addLoadingTask(taskId);

      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        removeLoadingTask(taskId);
      }
    };

    fetchPosts();
  }, [addLoadingTask, removeLoadingTask]);

  const truncateText = (text, maxLength = 150) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const togglePostExpansion = (postId) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  const toggleView = () => {
    setIsGridView((prev) => !prev);
  };

  return {
    posts,
    expandedPosts,
    isGridView,
    truncateText,
    togglePostExpansion,
    toggleView,
  };
}
