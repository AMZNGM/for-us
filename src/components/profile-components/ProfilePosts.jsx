import ProfilePostCard from "@/components/profile-components/ProfilePostCard";

export default function ProfilePosts({ posts }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12 text-text/60">
        <p>You haven't created any posts yet.</p>
      </div>
    );
  }

  return (
    <section className="my-12">
      <h2 className="text-xl font-semibold mb-6">
        Your Posts <span className="text-main">({posts.length})</span>
      </h2>

      <div className="space-y-8">
        {posts.map((post, index) => (
          <ProfilePostCard key={post.id} post={post} index={index} />
        ))}
      </div>
    </section>
  );
}
