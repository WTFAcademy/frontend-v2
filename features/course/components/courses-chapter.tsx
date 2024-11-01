import React from "react";
import Link from "next/link";

interface TCoursesChapterItemProps {
    index: number;
    coursesName: string;
    quizProgress: number;
    codeProgress: number;
    coursesState: number;
    link: string;
}

const CoursesSectionData = [
    {
        coursesName: "HelloWeb3",
        quizProgress: 100,
        codeProgress: 100,
        coursesState: 3,
        link: "/courses/helloweb3",
    },
    {
        coursesName: "ValueTypes",
        quizProgress: 98,
        codeProgress: 40,
        coursesState: 2,
        link: "/courses/valueTypes",
    },
    {
        coursesName: "Function",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/function",
    },
    {
        coursesName: "Function Output",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/functionOutput",
    },
    {
        coursesName: "Data Storage and Scope",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/dataStorageAndScope",
    },
    {
        coursesName: "Array & Struct",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/arrayStruct",
    },
    {
        coursesName: "Mapping",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/mapping",
    },
    {
        coursesName: "Initial Value",
        quizProgress: 0,
        codeProgress: 0,
        coursesState: 1,
        link: "/courses/initValue",
    },
];

function CoursesChapter() {
  return (
    <div className="relative w-[736px] felx flex-col pt-12">
        <h2 className="relative mb-2 font-bold">Chapters<span className="relative ml-2 text-gray-500 text-sm font-normal">({CoursesSectionData.length})</span></h2>
        <div className="relative mt-6 border border-gray-300 rounded-[6px] p-2">
            {
                CoursesSectionData.map((coursesData, index) => (
                    <CoursesChapterItem key={index} index={index + 1} {...coursesData} />
                ))
            }
        </div>
    </div>
  );
}

function CoursesChapterItem({ index, coursesName, quizProgress, codeProgress, coursesState, link } : TCoursesChapterItemProps) {
    return (
        <Link className="flex items-center justify-between p-4 cursor-pointer rounded-sm group hover:bg-gray-50 hover:no-underline" href={link}>
            <div className="relative flex items-center">
                <div className="relative w-[30px] h-[30px] mr-4 rounded-full inline-flex items-center justify-center bg-blue-50">
                    <span className="text-sm leading-none">{index}</span>
                </div>
                <h2 className="font-semibold">{coursesName}</h2>
            </div>
            <div className="relative flex items-center">
                <div className="relative mx-1 flex items-center justify-center rounded-sm w-20 py-[9px] border border-gray-300 shadow-sm overflow-hidden">
                    <QuizSvg />
                    <span className="ml-1 text-sm text-gray-700">Quiz</span>
                    <div className="absolute left-0 bottom-0 w-full h-1 bg-green-100"></div>
                    <div className="absolute left-0 bottom-0 w-0 h-1 bg-green-500" style={{ width: `${quizProgress}%` }}></div>
                </div>
                <div className="relative mx-1 flex items-center justify-center rounded-sm w-20 py-[9px] border border-gray-300 shadow-sm overflow-hidden">
                    <CodeSvg />
                    <span className="ml-1 text-sm text-gray-700">Code</span>
                    <div className="absolute left-0 bottom-0 w-full h-1 bg-green-100"></div>
                    <div className="absolute left-0 bottom-0 w-0 h-1 bg-green-500" style={{ width: `${codeProgress}%` }}></div>
                </div>
                <CoursesStates state={coursesState} />
            </div>
        </Link>
    );
}

function CoursesStates({ state }: { state: number }) {
    switch (state) {
        case 1:
            return (
                <div className="relative w-[124px] flex justify-end items-center">
                    <span className="mr-1 text-sm font-medium text-gray-500">Not Started</span>
                    <ArrowSvg />
                </div>
            );
        case 2:
            return (
                <div className="relative w-[124px] flex justify-end items-center">
                    <span className="mr-1 text-sm font-medium">In Progress</span>
                </div>
            );
        case 3:
            return (
                <div className="relative w-[124px] flex justify-end items-center">
                    <span className="mr-1 text-sm font-medium text-brand">Completed</span>
                    <CompletedSvg />
                </div>
            );
        default:
            return null;
    }
}

function QuizSvg() {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" width="17" height="16" viewBox="0 0 17 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.69995 3.19998C3.69995 2.31632 4.4163 1.59998 5.29995 1.59998H8.96858C9.39293 1.59998 9.79989 1.76855 10.1 2.0686L12.8313 4.79998C13.1314 5.10003 13.3 5.507 13.3 5.93135V12.8C13.3 13.6836 12.5836 14.4 11.7 14.4H5.29995C4.41629 14.4 3.69995 13.6836 3.69995 12.8V3.19998ZM5.29995 7.99998C5.29995 7.55815 5.65812 7.19998 6.09995 7.19998H10.9C11.3418 7.19998 11.7 7.55815 11.7 7.99998C11.7 8.4418 11.3418 8.79998 10.9 8.79998H6.09995C5.65812 8.79998 5.29995 8.4418 5.29995 7.99998ZM6.09995 10.4C5.65812 10.4 5.29995 10.7581 5.29995 11.2C5.29995 11.6418 5.65812 12 6.09995 12H10.9C11.3418 12 11.7 11.6418 11.7 11.2C11.7 10.7581 11.3418 10.4 10.9 10.4H6.09995Z" fill="#6B7280"/>
        </svg>
    );
}

function CodeSvg() {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.85306 2.44105C10.2722 2.58077 10.4987 3.03382 10.359 3.45298L7.15901 13.053C7.0193 13.4721 6.56624 13.6987 6.14708 13.5589C5.72793 13.4192 5.5014 12.9662 5.64112 12.547L8.84113 2.94702C8.98084 2.52786 9.4339 2.30133 9.85306 2.44105ZM4.56575 5.03431C4.87817 5.34673 4.87817 5.85326 4.56575 6.16568L2.73143 8L4.56575 9.83431C4.87817 10.1467 4.87817 10.6533 4.56575 10.9657C4.25332 11.2781 3.74679 11.2781 3.43437 10.9657L1.03436 8.56568C0.721944 8.25326 0.721944 7.74673 1.03436 7.43431L3.43437 5.03431C3.74679 4.72189 4.25332 4.72189 4.56575 5.03431ZM11.4344 5.03431C11.7468 4.72189 12.2533 4.72189 12.5658 5.03431L14.9658 7.43431C15.2782 7.74673 15.2782 8.25326 14.9658 8.56568L12.5658 10.9657C12.2533 11.2781 11.7468 11.2781 11.4344 10.9657C11.122 10.6533 11.122 10.1467 11.4344 9.83431L13.2687 8L11.4344 6.16568C11.122 5.85326 11.122 5.34673 11.4344 5.03431Z" fill="#6B7280"/>
        </svg>
    );
}

function CompletedSvg() {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M19.6833 15.1824C20.262 14.8763 20.7463 14.4183 21.0841 13.8576C21.4219 13.2968 21.6004 12.6546 21.6004 12C21.6004 11.3454 21.4219 10.7031 21.0841 10.1424C20.7463 9.58163 20.262 9.1236 19.6833 8.81758C19.8762 8.19201 19.8949 7.52569 19.7373 6.89031C19.5797 6.25493 19.2519 5.67454 18.7891 5.21159C18.3262 4.74864 17.7459 4.42065 17.1106 4.26291C16.4753 4.10517 15.8089 4.12366 15.1833 4.31638C14.8774 3.73739 14.4194 3.25281 13.8585 2.91481C13.2976 2.57681 12.6552 2.39819 12.0003 2.39819C11.3455 2.39819 10.703 2.57681 10.1422 2.91481C9.58131 3.25281 9.12326 3.73739 8.81733 4.31638C8.19177 4.12349 7.52545 4.10483 6.89007 4.2624C6.25469 4.41997 5.6743 4.7478 5.21135 5.21063C4.7484 5.67346 4.42041 6.25376 4.26267 6.8891C4.10493 7.52444 4.12341 8.19076 4.31613 8.81638C3.73714 9.1223 3.25256 9.58035 2.91456 10.1412C2.57656 10.7021 2.39795 11.3445 2.39795 11.9994C2.39795 12.6542 2.57656 13.2967 2.91456 13.8575C3.25256 14.4184 3.73714 14.8765 4.31613 15.1824C4.12325 15.8079 4.10458 16.4743 4.26215 17.1096C4.41972 17.745 4.74756 18.3254 5.21039 18.7884C5.67322 19.2513 6.25352 19.5793 6.88886 19.737C7.52419 19.8948 8.19052 19.8763 8.81613 19.6836C9.12206 20.2626 9.58011 20.7471 10.141 21.0851C10.7018 21.4231 11.3443 21.6018 11.9991 21.6018C12.654 21.6018 13.2964 21.4231 13.8573 21.0851C14.4182 20.7471 14.8762 20.2626 15.1821 19.6836C15.8077 19.8765 16.474 19.8951 17.1094 19.7376C17.7448 19.58 18.3252 19.2521 18.7881 18.7893C19.2511 18.3265 19.5791 17.7462 19.7368 17.1109C19.8945 16.4755 19.876 15.808 19.6833 15.1824ZM16.6281 9.83157C16.7686 9.63839 16.8267 9.3973 16.7894 9.16134C16.7522 8.92539 16.6227 8.71389 16.4295 8.57338C16.3339 8.5038 16.2255 8.45375 16.1105 8.42608C15.9955 8.3984 15.8761 8.39365 15.7593 8.41209C15.5233 8.44934 15.3118 8.57879 15.1713 8.77198L10.9917 14.52L8.73573 12.264C8.65267 12.1781 8.55333 12.1095 8.4435 12.0624C8.33368 12.0153 8.21557 11.9905 8.09606 11.9896C7.97656 11.9886 7.85806 12.0114 7.74748 12.0567C7.63689 12.102 7.53644 12.1689 7.45197 12.2534C7.36751 12.338 7.30073 12.4385 7.25553 12.5491C7.21033 12.6597 7.18761 12.7783 7.18871 12.8978C7.1898 13.0173 7.21469 13.1354 7.26191 13.2451C7.30912 13.3549 7.37773 13.4542 7.46373 13.5372L10.4637 16.5372C10.5557 16.6292 10.6665 16.7002 10.7885 16.7452C10.9105 16.7903 11.0409 16.8084 11.1705 16.7982C11.3002 16.7881 11.4262 16.7499 11.5397 16.6864C11.6532 16.6229 11.7516 16.5356 11.8281 16.4304L16.6281 9.83157Z" fill="#274BC9"/>
        </svg>
    );
}

function ArrowSvg() {
    return ( 
        <svg className="hidden group-hover:block" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M10.2929 3.29289C10.6834 2.90237 11.3166 2.90237 11.7071 3.29289L17.7071 9.29289C18.0976 9.68342 18.0976 10.3166 17.7071 10.7071L11.7071 16.7071C11.3166 17.0976 10.6834 17.0976 10.2929 16.7071C9.90237 16.3166 9.90237 15.6834 10.2929 15.2929L14.5858 11L3 11C2.44772 11 2 10.5523 2 10C2 9.44771 2.44772 9 3 9H14.5858L10.2929 4.70711C9.90237 4.31658 9.90237 3.68342 10.2929 3.29289Z" fill="#274BC9"/>
        </svg>
    );
}

export default CoursesChapter;