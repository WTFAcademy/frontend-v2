"use client";

import { useState } from "react";
import StepLogin from "./step-login";
import StepWallet from "./step-wallet";
import { isNil } from "lodash-es";
import StepMint from "./step-mint";

export enum ClaimStep {
    LOGIN,
    CONNECT_WALLET,
    MINT,
    MINT_SUCCESS
}

const ClaimStepper = () => {
    const [step, setStep] = useState(ClaimStep.LOGIN);

    const nextStep = (target?: ClaimStep) => {
        if (!isNil(target)) {
            setStep(target);
        } else {
            setStep(step + 1);
        }
    }

    return (
        <div className="w-full h-full bg-wtf-background-primary rounded-2xl shadow-modal py-8">
            <h3 className="text-wtf-text-primary text-2xl font-bold text-center pt-2 pb-5 md:pt-4 md:pb-6">Get NFT certificate</h3>
            <StepLogin nextStep={nextStep} />
            <StepWallet active={step === ClaimStep.CONNECT_WALLET} nextStep={nextStep} />
            <StepMint active={step === ClaimStep.MINT} nextStep={nextStep} />
        </div>
    )
}

export default ClaimStepper;
