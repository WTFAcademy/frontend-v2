"use client";

import AuthSectionLogin from "./auth-section-login";
import AuthSectionRegister from "./auth-section-register";
import { STEP } from "./auth-button";

type AuthCardProps = {
  updateStep: (step: STEP) => void;
  step: STEP;
}

const AuthCard = (props: AuthCardProps) => {
  const { updateStep, step } = props;
  console.log(step);

  return (
    <>
      {step === STEP.Login && <AuthSectionLogin updateStep={updateStep} />}
      {step === STEP.Register && <AuthSectionRegister updateStep={updateStep} />}
      {/* {step === STEP.ChangeWallet && <AuthSectionChangeWallet />} */}
    </>
  );
};

export default AuthCard;
