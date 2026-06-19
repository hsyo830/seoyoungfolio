import LiquidEther from "@/components/ui/LiquidEther";

export default function Home() {
  return (
    <>
      <div className="fixed inset-0 -z-10">
        <LiquidEther colors={["#aecbeb", "#83b0e1", "#71a5de"]} />
      </div>
      <main className="flex items-center justify-center flex-1">
        <p className="font-title text-text-primary">세팅 완료</p>
      </main>
    </>
  );
}
