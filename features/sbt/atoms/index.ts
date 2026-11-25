import { TCourse } from "@/features/course/api/use-courses-api";
import { atom } from "jotai";
import { SUGGESTED_DONATION_AMOUNT } from "../constants/nft";

export const claimAtom = atom<boolean>(false);
export const courseIdAtom = atom<number | null>(null);
// Suggested donation shown in the mint step. Minting itself is free: the
// contract only enforces `msg.value >= mintPrice` and the signed mintPrice is 0
// for free courses, so this value is a suggestion the user can edit or opt out
// of entirely (see donationOptInAtom).
export const donationAmountAtom = atom<number>(SUGGESTED_DONATION_AMOUNT);

// Whether the user opted in to donating. When false the mint transaction sends
// 0 value, regardless of the amount typed in the input.
export const donationOptInAtom = atom<boolean>(true);
export const courseAtom = atom<TCourse>();