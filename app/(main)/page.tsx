import Footer from "@/components/layout/footer";
import SectionBanner from "@/features/home/components/section-banner";
import SectionCommunity from "@/features/home/components/section-community";
import SectionContributors from "@/features/home/components/section-contributors";
import SectionCourses from "@/features/home/components/section-courses";
import SectionEvents from "@/features/home/components/section-events";
import SectionProjects from "@/features/home/components/section-projects";
import SectionSponsors from "@/features/home/components/section-sponsors";
import SectionStatistics from "@/features/home/components/section-statistics";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <div id="home" className="w-full flex flex-col">
        <SectionBanner />
        <div id="home-content" className="w-full h-full flex flex-col">
          <Suspense fallback={<SectionStatistics.Skeleton />}>
            <SectionStatistics />
          </Suspense>
          <Suspense fallback={<SectionCourses.Skeleton />}>
            <SectionCourses />
          </Suspense>
          <SectionCommunity />
          <SectionProjects />
          <SectionEvents />
          <SectionSponsors />
          <SectionContributors />
        </div>
      </div>
      <Footer />
    </>
  );
}
