import { Button } from "@/components/ui/button";
import ChapterDetailHeader from "@/features/course/components/chapter-detail-header";
import ChapterMobileContainer from "@/features/course/components/chapter-mobile-container";

const CourseChapterPage = ({
  params,
}: {
  params: { coursename: string; chaptername: string };
}) => {
  // return <div>CourseChapterPage: {params.coursename} - {params.chaptername}</div>
  console.log(params);
  return (
    <ChapterMobileContainer>
      <div className="relative flex-auto overflow-y-auto">
        <div className="p-10">
          <ChapterDetailHeader
            title="WTF Solidity: 2. Value Type"
            studyTime={20}
            bestScore={100}
          />
          <div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
            <div>content</div>
          </div>
        </div>
        <div className="sticky bottom-0 left-0 right-0 bg-wtf-background-block border-t border-wtf-border-divider px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button>Quiz</Button>
            <Button>Code</Button>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="secondary">Previous</Button>
            <Button variant="secondary">Next</Button>
          </div>
        </div>
      </div>
    </ChapterMobileContainer>
  );
};

export default CourseChapterPage;
