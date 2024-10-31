import { ReactNode } from "react";


const CourseChapterLayout = ({ children, params }: { children: ReactNode, params: { coursename: string } }) => {
    console.log(params);
    
    return <div>{children}</div>
}

export default CourseChapterLayout