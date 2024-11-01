import CoursesChapter from "@/features/course/components/courses-chapter";
import CoursesList from "@/features/course/components/courses-list";
import CoursesNFT from "@/features/course/components/courses-nft";
import CoursesOverview from "@/features/course/components/courses-overview";
import Footer from "@/components/layout/footer";

const CourseChapterPage = ({params}: {params: {coursename: string, chaptername: string}}) => {
    // return <div>CourseChapterPage: {params.coursename} - {params.chaptername}</div>
    return (
        <div className="relative mt-20">
            <CoursesList />
            <div className="relative w-[1440px] mx-auto mt-8 mb-40 flex justify-between">
                <div className="relative flex flex-col">
                    <CoursesOverview />
                    <CoursesNFT />
                    <div className="relative w-full flex flex-col">
                        <div className="relative flex">
                            <i></i>
                            <span>19,282 Builders Enrolled</span>
                        </div>
                    </div>
                </div>
                <CoursesChapter />
            </div>
            <Footer />
        </div>
    );
}

export default CourseChapterPage