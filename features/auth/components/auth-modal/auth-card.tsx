"use client";

import AuthSectionLogin from "./auth-section-login";
import AuthSectionRegister from "./auth-section-register";
import { STEP } from ".";

type AuthCardProps = {
  updateStep: (step: STEP) => void;
  step: STEP;
  close: () => void;
};

const AuthCard = (props: AuthCardProps) => {
  const { updateStep, step, close } = props;

  return (
    <>
      {step === STEP.Login && <AuthSectionLogin updateStep={updateStep} close={close} />}
      {step === STEP.Register && <AuthSectionRegister updateStep={updateStep} close={close} />}
      {/* {step === STEP.ChangeWallet && <AuthSectionChangeWallet />} */}
    </>
  );
};

export default AuthCard;
