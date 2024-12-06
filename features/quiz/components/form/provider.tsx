import React from "react";
import {
  FormProvider as RHFFormProvider,
  UseFormReturn,
} from "react-hook-form";
import { cn } from "@/lib/utils";

interface Props {
  children: any;
  methods: UseFormReturn<any>;
  onSubmit?: any;
  className?: string;
}

export default function FormProvider({
  children,
  onSubmit,
  methods,
  className,
}: Props) {
  return (
    <RHFFormProvider {...methods}>
      <form
        className={cn("w-full", className)}
        onSubmit={methods.handleSubmit(onSubmit)}
      >
        {children}
      </form>
    </RHFFormProvider>
  );
}
