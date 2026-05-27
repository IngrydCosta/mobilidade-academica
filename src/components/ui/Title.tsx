
type TitleProps = {
  title:string;
  subtitle?:string;
  size?:string;
  className?:string;
  icon?:React.ReactNode;

};


function Title({title, subtitle, size = "text-5xl", className, icon}: TitleProps) {
  return (
    <div className={`text-[#0E284E] flex flex-col mt-6 ${className}`}>
                    <p>{icon}</p>
                    <h1 className={`${size} font-medium p-2 ml-2`}><span>{title}</span> </h1>
                    <h2 className="font-light p-2 ml-3 text-[#404c4e]"><span>{subtitle}</span></h2>
                </div>
  )
}

export default Title
