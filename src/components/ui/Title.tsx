
function Title(props:{title:string, subtitle:string}) {
  return (
    <div className=" text-[#0E284E] flex flex-col mt-20 ml-70">
                    <h1 className="font-medium text-5xl p-2 ml-2"><span>{props.title}</span> </h1>
                    <h2 className="font-light p-2 ml-3 text-[#404c4e]"><span>{props.subtitle}</span></h2>
                </div>
  )
}

export default Title
