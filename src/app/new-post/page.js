import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import PageWrapper from "@/components/page-components/PageWrapper";
import CreateNewPost from "@/components/post-components/CreateNewPost";

export default function NewPostPage() {
  return (
    <ProtectedRoute>
      <PageWrapper look="bright" imageCLassName="opacity-15!">
        <CreateNewPost />
      </PageWrapper>
    </ProtectedRoute>
  );
}
