import Header from "@/components/layout/header";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header />
      <main className="w-full h-full flex flex-col">
        {children}
      </main>
    </>
  );
};

export default MainLayout;
