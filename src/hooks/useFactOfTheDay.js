import { useEffect, useState } from "react";
import { getPosts } from "@/lib/getPosts";

export function useFactOfTheDay() {
  const [posts, setPosts] = useState([]);
  const [expandedPosts, setExpandedPosts] = useState(new Set());
  const [isGridView, setIsGridView] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts();
        setPosts(fetchedPosts);
      } catch (err) {
        console.error("Error fetching posts:", err);
      }
    };

    fetchPosts();
  }, []);

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
