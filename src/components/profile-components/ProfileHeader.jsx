export default function ProfileHeader({ name }) {
  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold text-main">{name || "Profile"}</h1>
      <p className="text-text/70 mt-1">Manage your profile and posts</p>
    </header>
  );
}
