import React from "react";
import { Button } from "@/components/ui/button";

function CoursesOverview() {
  return (
    <div className="relative w-[400px] felx flex-col mb-14">
        <div className="relative inline-flex mb-6 px-[10px] py-1 rounded-full border-gray-500 border-[0.5px] ">
          <span className="text-sm text-gray-500">Solidity</span>
        </div>
        <h2 className="relative mb-6 font-press_start_2p text-xl leading-none">Solidity 103</h2>
        <p className="relative mb-6 text-sm">Welcome to the Solidity 101 course by WTF Academy! This course will introduce you to Solidity, the programming language for developing Ethereum smart contracts. </p>
        <div className="relative mb-6 flex gap-x-16">
          <div className="relative text-sm leading-none">
            <p className="font-opposans mb-1.5">Solidity</p>
            <p className="opacity-60">category</p>
          </div>
          <div className="relative text-sm leading-none">
            <p className="font-opposans mb-1.5">Simple</p>
            <p className="opacity-60">Difficulty</p>
          </div>
          <div className="relative text-sm leading-none">
            <p className="font-opposans mb-1.5">1.5h</p>
            <p className="opacity-60">Study time</p>
          </div>
        </div>
        <div className="relative flex">
          <Button>Start Learning</Button>
          <div className="relative ml-4 inline-flex items-center">
            <UserSvg />
            <span className="text-gray-500 text-sm leading-none ml-1">19,282 Builders Enrolled</span>
          </div>
        </div>
    </div>
  );
}

function UserSvg() {
  return ( 
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M4.26753 14.8365C5.96056 13.8795 7.9165 13.3333 10 13.3333C12.0835 13.3333 14.0394 13.8795 15.7325 14.8364M12.5 8.33333C12.5 9.71405 11.3807 10.8333 10 10.8333C8.61929 10.8333 7.5 9.71405 7.5 8.33333C7.5 6.95262 8.61929 5.83333 10 5.83333C11.3807 5.83333 12.5 6.95262 12.5 8.33333ZM17.5 10C17.5 14.1421 14.1421 17.5 10 17.5C5.85786 17.5 2.5 14.1421 2.5 10C2.5 5.85786 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.85786 17.5 10Z" stroke="#6B7280" stroke-width="1.66667" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  );
}

export default CoursesOverview;