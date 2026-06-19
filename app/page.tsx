import Grainient from "@/components/ui/Grainient";

export default function Home() {
  return (
    <>
      {/* Fixed grainy gradient background */}
      <div className="fixed inset-0 -z-10">
        <Grainient
          color1="#d8d2cb"
          color2="#d8d6d0"
          color3="#d8d3cc"
        />
      </div>

      {/* Hero */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6 text-center select-none">
        <h1
          className="font-title font-bold leading-none tracking-tighter text-text-primary"
          style={{ fontSize: "clamp(4rem, 14vw, 11rem)" }}
        >
          FRONTEND
          <br />
          DEVELOPER
        </h1>

        <p
          className="mt-6 font-title font-medium tracking-widest uppercase text-text-secondary"
          style={{ fontSize: "clamp(0.85rem, 2vw, 1.1rem)", letterSpacing: "0.35em" }}
        >
          Seo Young
        </p>

        <p
          className="mt-4 font-body text-text-secondary"
          style={{ fontSize: "clamp(0.9rem, 1.6vw, 1.1rem)" }}
        >
          Designing experiences, building interactions.
        </p>
      </main>
    </>
  );
}
