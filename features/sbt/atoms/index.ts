import { TCourse } from "@/features/course/api/use-courses-api";
import { atom } from "jotai";

export const claimAtom = atom<boolean>(false);
export const courseIdAtom = atom<number | null>(null);
export const donationAmountAtom = atom<number>(0.1);
export const courseAtom = atom<TCourse>();