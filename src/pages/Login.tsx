import {Link, useNavigate } from 'react-router-dom';
import{ useState} from 'react';
import Input from '../components/ui/Input';
import axios from "axios";
import Button from '../components/ui/Button';




 function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleLogin(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    const response = await axios.post("http://localhost:3333/login", {
        email: email,
        password: password,
    });


    localStorage.setItem("token", response.data.token);

    navigate("/dashboard");

  }


return(

    <main className='min-h-screen flex flex-col md:flex-row'>
        <section className='hidden md:flex md:w-1/2 bg-[#173764] text-white p-12 flex-col font-serif'>
        <div className='flex items-center gap-2 mb-10'>
            <div className='bg-orange-200 p-2 rounded-lg text-[#002147]'>
                <div>
                    <h1 className=' font-bold text-lg leading-tight'>OpenEu</h1>
                    <p className='opacity-70 mt-4 text-xs'>MOBILITY DASHBOARD</p>
                </div>
            </div>
        </div>
            <div className='flex 1 flex-col justify-center gap-5'>
                <h2 className='text-3xl  font-serif mb-5'>Mobilidade Académica</h2>
                <p className='opacity-80 mt-4 text-md'>Plataforma europeia de mobilidade estudantil</p>
                 <Link to='/Dashboard' className='text-sm flex items-center p-05 mb-30 font-serif text-[#D3A969] font-semibold'><span>Ver dashboard público</span></Link>
            </div>

           
        </section>

        <section className='w-full md:w-1/2 bg-whit flex flex-col justify-center items-center p-8'>
            <div className='w-full max-w-md'>
                <h3 className='text-xl font-serif mb-8'>Bem-vindo</h3>
                <form className='space-y-6' onSubmit={handleLogin}>
                    <Input
                        label='Email'
                        type='email' 
                        placeholder='email@universidade.eu'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        />

                    <Input 
                        label='Palavra-passe'
                        type='password'
                        placeholder='......'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button>
                            Iniciar Sessão
                        </Button>
                         
                </form>
            </div>
        </section>
    </main>
)

};

export default Login