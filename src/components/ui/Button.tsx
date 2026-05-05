import type { ButtonHTMLAttributes, ReactNode } from "react";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
    children: ReactNode;

}

export default function Button({children, ...props}: ButtonProps){
    return(
        <button
        {...props}
        className="w-full bg-[#002147] hover:bg-[#003366] text-white font-medium py-3 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
        {children}
        </button>
    );
}