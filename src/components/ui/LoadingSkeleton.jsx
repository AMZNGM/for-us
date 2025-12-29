export default function LoadingSkeleton() {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-main flex justify-center items-center">
      <div className="flex flex-col justify-center items-center gap-2 animate-pulse">
        <div className="bg-text/50 rounded-lg h-8 w-32"></div>
        <div className="bg-text/40 rounded-lg h-4 w-64"></div>
      </div>
    </div>
  );
}
