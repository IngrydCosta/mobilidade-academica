




type CardProps = {

  icon?:React.ReactNode;
  title:string;
  number?:number;
  subtitle?: string;
}
function Card({icon,title,number, subtitle}: CardProps) {
  
  return (
      <div className="w-full bg-[#FFFFFF] border border-[#404c4e]/20 shadow-md px-6 py-6 rounded-lg">
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col">
              <span   className="text-[#404c4e] text-sm md:text-base break-word">{title}</span>
              <p>{subtitle}</p>
              <span className="text-[#0E284E] font-bold text-2xl mt-4 block">{number}</span>
            </div>
              <span  className="bg-[#E7EAED] p-3 rounded-lg shrink-0">{icon}</span>
              
          </div>
  
      </div>
  )
}

export default Card;

