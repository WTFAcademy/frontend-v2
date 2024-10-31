import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CliamAcces = false;

function CoursesNFT() {
  return (
    <div className="parallax-effect relative w-[320px] felx flex-col border border-gray-300 rounded-sm px-8 pt-8 pb-16 overflow-hidden">
        <BgTopSvg />
        <BgBottomSvg />
        <h2 className="relative mb-2 font-semibold">Course Certificate NFT</h2>
        <p className="relative text-gray-500 text-sm mb-3">Claim certificate NFT after you complete all the course exercises.</p>
        <Button className={cn("relative mb-10 bg-brand-muted text-brand dark:text-content", CliamAcces ? "cursor-pointer" : "cursor-not-allowed")}>
            <ClaimSvg />
            <span className="ml-2">Claim NFT</span>
        </Button>
        <div className="inner-element">
            <div className="w-[256px] h-[130px] shadow-[0_4px_16px_0px_rgba(0,0,0,0.12)] ">
                <img className="w-full h-full" src="https://vjcxgodediuyprqxqpzo.supabase.co/storage/v1/object/public/images/test-coursesNFT.png" alt="Course Certificate NFT"/>
            </div>
        </div>
    </div>
  );
}

function ClaimSvg() {
    return ( 
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M4.0001 1.59998C4.44193 1.59998 4.8001 1.95815 4.8001 2.39998V3.19998H5.6001C6.04192 3.19998 6.4001 3.55815 6.4001 3.99998C6.4001 4.4418 6.04192 4.79998 5.6001 4.79998H4.8001V5.59998C4.8001 6.0418 4.44193 6.39998 4.0001 6.39998C3.55827 6.39998 3.2001 6.0418 3.2001 5.59998V4.79998H2.4001C1.95827 4.79998 1.6001 4.4418 1.6001 3.99998C1.6001 3.55815 1.95827 3.19998 2.4001 3.19998H3.2001V2.39998C3.2001 1.95815 3.55827 1.59998 4.0001 1.59998ZM4.0001 9.59998C4.44193 9.59998 4.8001 9.95815 4.8001 10.4V11.2H5.6001C6.04192 11.2 6.4001 11.5581 6.4001 12C6.4001 12.4418 6.04192 12.8 5.6001 12.8H4.8001V13.6C4.8001 14.0418 4.44193 14.4 4.0001 14.4C3.55827 14.4 3.2001 14.0418 3.2001 13.6V12.8H2.4001C1.95827 12.8 1.6001 12.4418 1.6001 12C1.6001 11.5581 1.95827 11.2 2.4001 11.2H3.2001V10.4C3.2001 9.95815 3.55827 9.59998 4.0001 9.59998Z" fill="#3F69D5"/>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.60006 1.59998C9.96304 1.59998 10.2805 1.84436 10.3734 2.19526L11.3168 5.75912L13.9998 7.30703C14.2475 7.4499 14.4001 7.71407 14.4001 7.99998C14.4001 8.28588 14.2475 8.55005 13.9998 8.69292L11.3168 10.2408L10.3734 13.8047C10.2805 14.1556 9.96304 14.4 9.60006 14.4C9.23707 14.4 8.91958 14.1556 8.82669 13.8047L7.88332 10.2408L5.20032 8.69292C4.95267 8.55005 4.8001 8.28588 4.8001 7.99998C4.8001 7.71407 4.95267 7.4499 5.20032 7.30703L7.88332 5.75912L8.82669 2.19526C8.91958 1.84436 9.23707 1.59998 9.60006 1.59998Z" fill="#3F69D5"/>
        </svg>
    );
}

function BgTopSvg() {
    return (
        <svg className="absolute left-0 top-0" width="25" height="119" viewBox="0 0 25 119" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5">
                <rect id="top-face" width="67.55" height="67.55" transform="matrix(0.866025 0.5 -0.866025 0.5 -33.5002 -17)" fill="#EBEBEB"/>
                <rect id="right-face" width="67.55" height="67.55" transform="matrix(0.866025 -0.5 0 1 -33.5002 50.55)" fill="#DCDCDC"/>
            </g>
        </svg>
    )
}

function BgBottomSvg() {
    return (
        <svg className="absolute bottom-0 right-4" width="100" height="24" viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.5">
                <rect id="top-face" width="57.4999" height="57.4999" transform="matrix(0.866025 0.5 -0.866025 0.5 49.7961 0.0756836)" fill="#EBEBEB"/>
            </g>
        </svg>
    )
}

export default CoursesNFT;