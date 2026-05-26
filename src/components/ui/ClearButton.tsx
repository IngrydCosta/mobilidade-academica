import { LuEraser } from "react-icons/lu";

type ClearButtonProps = {
  onClick: () => void;
}

function ClearButton({onClick}: ClearButtonProps) {
  return (
    <div>
      <button  onClick={onClick}   className="border border-gray-300 text-[#173764] font-bold px-5 py-2 rounded-md mt-4 flex gap-2 items-center shrink-0 cursor-pointer">
                       <LuEraser /> <p>Limpar</p>
        </button>
    </div>
  )
}

export default ClearButton;