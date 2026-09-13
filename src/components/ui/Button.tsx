import type { ButtonHTMLAttributes, ReactNode } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;

}

export default function Button({children, className, ...props}: ButtonProps){
    return(
        <button
        {...props}
        className={`w-full bg-[#173764] hover:bg-[#1f477d] text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300 disabled:opacity-50 ${className || ""}`}>
        {children}
        </button>
    );
}