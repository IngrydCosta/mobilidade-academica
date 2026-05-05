import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
    label: string;
}

export default function Input({label, ...props}: InputProps){
    return(
        <div className="flex flex-col gap-2 w-full">
            <label className="text-sm font-medium text-gray-700">{label}</label>
            <input 
                {...props}
                className="w-full p-3 border border-gray-300 rounded-md outline-more focus:border-blue-500 transition-colors placeholder: text-gray-600 "
            />
        </div>
    )
}