import React from "react";
import Link from "next/link";

interface TCoursesSectionProps {
    coursesName: string;
    items: { link: string }[];
}

const CoursesSectionData = [
    {
        coursesName: "Solidity",
        items: [
            {
                link: "/courses/solidity-101",
            },
            {
                link: "/courses/solidity-102",
            },
            {
                link: "/courses/solidity-103",
            },
        ],
    },
    {
        coursesName: "EVM",
        items: [
            {
                link: "/courses/EVM-101",
            },
            {
                link: "/courses/EVM-102",
            },
        ],
    },
    {
        coursesName: "Ethers",
        items: [
            {
                link: "/courses/ethers-101",
            },
            {
                link: "/courses/ethers-102",
            },
            {
                link: "/courses/ethers-103",
            },
            {
                link: "/courses/ethers-104",
            },

        ],
    },
    {
        coursesName: "Layer 2",
        items: [
            {
                link: "/courses/layer2-101",
            },
            {
                link: "/courses/layer2-102",
            },
            {
                link: "/courses/layer2-103",
            },
        ],
    },
    {
        coursesName: "Vyper",
        items: [
            {
                link: "/courses/vyper-101",
            },
            {
                link: "/courses/vyper-102",
            },
        ],
    },
    {
        coursesName: "JavaScript",
        items: [
            {
                link: "/courses/javascript-101",
            },
            {
                link: "/courses/javascript-102",
            },
        ],
    },
    {
        coursesName: "TypeScript",
        items: [
            {
                link: "/courses/typescript-101",
            },
            {
                link: "/courses/typescript-102",
            },
        ],
    },
    {
        coursesName: "Python",
        items: [
            {
                link: "/courses/python-101",
            },
            {
                link: "/courses/python-102",
            },
        ],
    },
];

function CoursesList() {
    return (
        <section className="relative px-8 bg-gray-50">
            <div className="relative flex pt-3 pb-4 border-b border-b-gray-50 overflow-x-auto">
                {CoursesSectionData.map((section, index) => (
                    <CoursesSection key={index} coursesName={section.coursesName} items={section?.items} />
                ))}
            </div>
        </section>
    );
}

function CoursesSection({ coursesName, items }: TCoursesSectionProps) {
    return (
        <div className="flex flex-col">
            <h2 className="relative mb-[6px] text-gray-500 text-xs leading-none">{coursesName}</h2>
            <div className="flex">
                {items &&
                    items.map((item, index) => (
                        <Link className="relative flex mr-[10px]" href="javascript:void(0);" key={index}>
                            <div className="w-[108px] h-[72px] bg-blue-300">
                                <img src="https://placeholderjs.com/108x72" alt="placeholder" />
                            </div>
                        </Link>
                    )
                )}
            </div>
        </div>
    );
}

export default CoursesList;