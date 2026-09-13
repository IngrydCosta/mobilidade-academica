import {Link, useNavigate } from 'react-router-dom';
import{ useState} from 'react';
import Input from '../components/ui/Input';
import axios from "axios";
import Button from '../components/ui/Button';




function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotLoading, setForgotLoading] = useState<boolean>(false);
  const [forgotMsg, setForgotMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();

  async function handleLogin(e?: React.FormEvent<HTMLFormElement>) {
    e?.preventDefault();

    try {
      const response = await axios.post("http://localhost:3333/auth/login", {
        email: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      localStorage.setItem("@mobilidade:token", response.data.token);
      localStorage.setItem("@mobilidade:user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data?.message || "Email ou palavra-passe incorretos.");
      }   else {
        alert("Erro ao realizar login.");
      }
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setForgotMsg(null);
    setForgotLoading(true);

    try {
      const response = await axios.post('http://localhost:3333/auth/forgot-password', {
        email: forgotEmail,
      });

      setForgotMsg({
        type: 'success',
        text: response.data.message || 'Instruções enviadas com sucesso!',
      });
    } catch (err: any) {
      setForgotMsg({
        type: 'error',
        text: err.response?.data?.message || 'Falha ao solicitar recuperação de senha.',
      });
    } finally {
      setForgotLoading(false);
    }
  }


return(

    <main className='min-h-screen flex flex-col md:flex-row'>
      <section className='hidden md:flex md:w-1/2 bg-[#173764] text-white p-12 flex-col font-serif'>
        <div className='flex items-center gap-2 mb-10'>
          <div className='bg-orange-200 p-2 rounded-lg text-[#002147]'>
            <div>
              <h1 className=' font-bold text-lg leading-tight'>MAI</h1>
              <p className='opacity-70 mt-4 text-xs'>MOBILITY DASHBOARD</p>
            </div>
          </div>
        </div>
        <div className='flex-1 flex flex-col justify-center gap-5'>
          <h2 className='text-3xl  font-serif mb-5'>Mobilidade Académica</h2>
          <p className='opacity-80 mt-4 text-md'>Plataforma europeia de mobilidade estudantil</p>
          <Link to='/' className='text-sm flex items-center p-0.5 mb-30 font-serif text-[#D3A969] font-semibold'>
            <span>Ver dashboard público</span>
          </Link>
        </div>


      </section>

      <section className='w-full md:w-1/2 bg-white flex flex-col justify-center items-center p-8 relative'>
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

            <div>
              <Input
                label='Palavra-passe'
                type='password'
                placeholder='......'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotModal(true);
                    setForgotMsg(null);
                    setForgotEmail(email);
                  }}
                  className="text-xs text-[#173764] hover:underline font-medium cursor-pointer"
                >
                  Esqueceu a palavra-passe?
                </button>
              </div>
            </div>

            <Button>
              Iniciar Sessão
            </Button>
          </form>
        </div>

        {showForgotModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 text-gray-800">
            <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
              <h4 className="text-xl font-bold text-[#0E284E] mb-2 font-serif">Recuperar Palavra-passe</h4>
              <p className="text-sm text-gray-600 mb-4">
                Digite seu e-mail cadastrado. Enviaremos uma nova palavra-passe temporária para sua caixa de entrada.
              </p>

              {forgotMsg && (
                <div
                  className={`p-3 mb-4 rounded-md text-sm ${
                    forgotMsg.type === 'success'
                      ? 'bg-green-50 border border-green-300 text-green-800'
                      : 'bg-red-50 border border-red-300 text-red-800'
                  }`}
                >
                  <p className="font-semibold">{forgotMsg.text}</p>
                </div>
              )}

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <Input
                  label="Seu E-mail"
                  type="email"
                  placeholder="exemplo@universidade.eu"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer disabled:opacity-50"
                  >
                    {forgotLoading ? 'Enviando...' : 'Enviar Recuperação'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>
    </main>
)

};

export default Login