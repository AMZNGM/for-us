"use client";

import { useProfile } from "@/hooks/useProfile";
import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import LoadingFlower from "@/components/loading-components/LoadingFlower";
import ProfileHeader from "@/components/profile-components/ProfileHeader";
import ProfileAvatar from "@/components/profile-components/ProfileAvatar";
import ProfileForm from "@/components/profile-components/ProfileForm";
import ProfilePosts from "@/components/profile-components/ProfilePosts";

export default function ProfilePage() {
  const {
    userState,
    profile,
    posts,
    preview,
    loading,
    handleAvatarChange,
    updateProfileField,
    saveProfile,
  } = useProfile();

  if (loading)
    return (
      <ProtectedRoute>
        <LoadingFlower />
      </ProtectedRoute>
    );

  if (!userState) {
    return (
      <ProtectedRoute>
        <LoadingFlower />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LoadingFlower />
      <div className="relative w-full h-full min-h-screen bg-bg text-main py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <ProfileHeader name={profile?.displayName} />

          <ProfileAvatar
            preview={preview}
            onAvatarChange={handleAvatarChange}
          />

          <ProfileForm
            profile={profile}
            onProfileChange={updateProfileField}
            saveProfile={saveProfile}
            loading={loading}
          />

          <ProfilePosts posts={posts} loading={loading} />
        </div>
      </div>
    </ProtectedRoute>
  );
}
