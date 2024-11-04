import Header from "@/components/layout/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="w-full h-screen overflow-auto flex flex-col">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
