import MainBtn from "@/components/ui/buttons/MainBtn";

export default function ProfileForm({
  profile,
  onProfileChange,
  saveProfile,
  loading,
}) {
  const handleChange = (field) => (e) => {
    onProfileChange(field, e.target.value);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Name</label>
        <input
          value={profile?.displayName || ""}
          onChange={handleChange("displayName")}
          className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0 focus:ring-2 focus:ring-main/50 focus:border-transparent transition-all"
          placeholder="Enter your name"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          value={profile?.bio || ""}
          onChange={handleChange("bio")}
          className="w-full px-3 py-2 bg-text/10 border border-text/20 rounded-lg text-text placeholder-text/50 outline-0 focus:ring-2 focus:ring-main/50 focus:border-transparent transition-all"
          rows={3}
          placeholder="Tell us about yourself..."
        />
      </div>

      <MainBtn onClick={saveProfile} disabled={loading}>
        {loading ? "Saving..." : "Save Profile"}
      </MainBtn>
    </div>
  );
}
