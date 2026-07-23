import NotifyOnLoad from "./NotifyOnLoad";

export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#000",
      }}
    >
      <NotifyOnLoad />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/display-image.svg"
        alt="Static display"
        style={{ maxWidth: "100%", maxHeight: "100vh" }}
      />
    </main>
  );
}
