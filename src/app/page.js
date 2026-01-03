import ProtectedRoute from "@/components/page-components/ProtectedRoute";
import { HomePageWrapper } from "@/components/page-components/PageWrapper";
import Logo from "@/components/ui/Logo";
import FlowersNav from "@/components/ui/FlowersNav";

export const metadata = {
  title: "For Us <3",
  description: "Just Yassira and Abdelrahman page, nothing more nothing less.",
};

export default function Home() {
  return (
    <ProtectedRoute>
      <HomePageWrapper>
        <Logo />
        <FlowersNav />
      </HomePageWrapper>
    </ProtectedRoute>
  );
}
