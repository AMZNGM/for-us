import Link from "next/link";
import ProtectedRoute from "@/components/page-components/ProtectedRoute";

export const metadata = {
  title: "Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <ProtectedRoute>
      <main className="relative w-screen h-screen overflow-hidden bg-main text-text flex flex-col justify-center items-center gap-4 py-24 px-4 z-50">
        <p className="text-lg">the page is not available</p>
        <Link
          href={"/"}
          className="rounded-2xl hover:bg-indigo-400 hover:text-white transition-colors duration-300 py-2 px-4"
        >
          Go Back Home
        </Link>
      </main>
    </ProtectedRoute>
  );
}
