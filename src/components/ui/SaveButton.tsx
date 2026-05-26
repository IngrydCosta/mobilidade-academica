import { FiSave } from "react-icons/fi";

type SaveButtonProps = {
    onClick: () => void;
    className?: string;
    nameButton: string;

}

function SaveButton({onClick, className, nameButton}: SaveButtonProps) {
  return (
    <div>
        <button onClick={onClick} className={`bg-[#173764] text-white px-5 py-2 rounded-md mt-4 flex gap-2 items-center shrink-0 cursor-pointer ${className}`}>
                          <FiSave /> <p>{nameButton}</p>
        </button >
    </div>
  )
}

export default SaveButton