 import { type ReactNode } from "react";

type ContainerProps = {
  children: ReactNode;
  className?: string;
};

export default function Container({ children, className = "" }: ContainerProps) {
  return (
    <div
      className={`
        w-full
        mx-auto
        max-w-[3000px]
        px-5           /* Mobile  = 20px */
        sm:px-[34px]   /* Tablet  = 34px */
        lg:px-12       /* Desktop = 48px */
        xl:px-[70px]   /* Large   = 70px */
        ${className}
      `}
    >
      {children}
    </div>
  );
}