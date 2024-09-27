import Image from "next/image";
import SectionHeader from "./section-header";
import projectsData from "@/public/constants/projects/projects.json";

type TProject = {
  name: string;
  description: string;
  banner_image: string;
  logo_image: string;
};

const projects: TProject[] = projectsData;

const SectionProjects = () => {
  return (
    <section className="container flex flex-col">
      <SectionHeader
        title="Community Development Projects"
        description="Projects under development in the community"
      />
      <div className="grid grid-cols-1 md:grid-cols-2">
        {projects.map((project) => (
          <div
            key={project.name}
            className="flex flex-col gap-6 p-8 md:p-10 border-wtf-border-divider border-[0.5px] border-solid"
          >
            <div className="relative w-full h-[180px] md:h-[280px]">
              <Image
                src={project.banner_image}
                alt={project.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-16 shrink-0 rounded-full bg-wtf-black/[.16] inline-flex items-center justify-center">
                <Image
                  src={project.logo_image}
                  alt={project.name}
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col gap-y-2">
                <div className="text-wtf-text-1 text-[22px] font-bold leading-none">
                  {project.name}
                </div>
                <div className="text-wtf-text-3 text-base font-normal leading-6">
                  {project.description}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default SectionProjects;
