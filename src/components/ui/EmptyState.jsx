export default function EmptyState() {
  return (
    <div className="col-span-full h-170 flex flex-col items-center justify-center bg-text text-center shadow rounded-2xl p-8">
      <div className="text-6xl mb-4">🌸</div>
      <div
        className="relative w-[45px] h-[45px] animate-spin"
        style={{
          animationDuration: "3.5s",
          animationTimingFunction: "ease-in-out",
        }}
      >
        <div className="absolute top-[8.25%] left-[8.25%] w-[19.575px] h-[19.575px] rounded-[50%_50%_3px] overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div
            className="relative z-10 w-full h-full bg-black origin-bottom-right rounded-[0_0_2.25px_0]"
            style={{
              transform: "rotate(45deg) translate(-3%, 50%) scaleX(1.2)",
              animation: "flow 3.5s linear infinite",
            }}
          ></div>
        </div>
        <div className="absolute bottom-[8.25%] right-[8.25%] w-[19.575px] h-[19.575px] rounded-[50%_50%_3px] overflow-hidden rotate-180 self-end">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div
            className="relative z-10 w-full h-full bg-black origin-bottom-right rounded-[0_0_2.25px_0]"
            style={{
              transform: "rotate(45deg) translate(-3%, 50%) scaleX(1.2)",
              animation: "flow 3.5s linear infinite",
              animationDelay: "-1.75s",
            }}
          ></div>
        </div>
      </div>

      <p className="text-bg bg-main/50 p-12 rounded-2xl mt-8">
        🌸 Nothing here yet! 🌸
        <br />
      </p>
    </div>
  );
}

const styles = `
  @keyframes flow {
    0% {
      transform: rotate(45deg) translate(-3%, 50%) scaleX(1.2);
    }
    30% {
      transform: rotate(45deg) translate(115%, 50%) scaleX(1.2);
    }

    30.001%,
    50% {
      transform: rotate(0deg) translate(-85%, -85%) scaleX(1);
    }

    80%,
    100% {
      transform: rotate(0deg) translate(0%, 0%) scaleX(1);
    }
  }
`;

if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}
