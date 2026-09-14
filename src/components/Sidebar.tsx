import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdDashboard } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoBookOutline } from "react-icons/io5";
import { AiOutlineLogin } from "react-icons/ai";
import { GoTrophy } from "react-icons/go";
import { FiKey } from "react-icons/fi";
import { API_URL } from "../services/api";
import axios from 'axios';
import Input from './ui/Input';

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("user") || localStorage.getItem("@mobilidade:user");
  const user = userStr ? JSON.parse(userStr) : null;
  const isAdmin = user?.perfil === "ADMINISTRADOR";
  const canManage = user?.perfil === "ADMINISTRADOR" || user?.perfil === "GESTOR_MOBILIDADE";

  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [oldPassword, setOldPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("@mobilidade:token");
    localStorage.removeItem("@mobilidade:user");
    navigate("/login");
  };

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setStatusMsg(null);

    if (newPassword !== confirmPassword) {
      setStatusMsg({ type: 'error', text: 'A nova palavra-passe e a confirmação não coincidem.' });
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token') || localStorage.getItem('@mobilidade:token');
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        { oldPassword, newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setStatusMsg({ type: 'success', text: response.data.message || 'Palavra-passe alterada com sucesso!' });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setStatusMsg({
        type: 'error',
        text: err.response?.data?.message || 'Erro ao alterar palavra-passe. Verifique a senha atual.',
      });
    } finally {
      setLoading(false);
    }
  }

  const getLinkClasses = (path: string) => {
    const isActive = location.pathname === path;
    return isActive
      ? 'bg-[#D9A95E] text-[#0C2445] font-semibold rounded-md p-2.5 px-4 cursor-pointer flex items-center gap-3 transition-colors'
      : 'text-white hover:bg-white/10 hover:text-white rounded-md p-2.5 px-4 cursor-pointer flex items-center gap-3 transition-colors';
  };

  const getIconClasses = (path: string) => {
    const isActive = location.pathname === path;
    return `h-5 w-5 md:h-6 md:w-6 shrink-0 ${isActive ? 'text-[#0C2445]' : 'text-[#FFFFFF]'}`;
  };

  return (
    <>
      <aside className='sticky top-0 h-screen w-64 shrink-0 bg-[#173764] text-[#FFFFFF] flex flex-col border-r border-white/10 overflow-y-auto'>
        <div className='p-6 flex items-center gap-3 border-b border-white/5'>
          <div className='bg-orange-200 p-1.5 rounded-md text-[#002147] text-sm'></div>
          <div>
            <h1 className='font-bold text-sm leading-tight'>Mobilidade Acadêmica</h1>
            <p className='text-[10px] opacity-60 uppercase tracking-wider'>Mobility Dashboard</p>
          </div>
        </div>

        <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
          <Link to="/dashboard" className={getLinkClasses("/dashboard")}>
            <MdDashboard className={getIconClasses("/dashboard")}/>
            <span>Dashboard</span>
          </Link>
          <Link to="/rankings" className={getLinkClasses("/rankings")}>
            <GoTrophy className={getIconClasses("/rankings")}/>
            <span>Rankings</span>
          </Link>
          {canManage && (
            <Link to="/registarMobilidade" className={getLinkClasses("/registarMobilidade")}>
              <IoAddCircleOutline className={getIconClasses("/registarMobilidade")}/>
              <span>Registar Mobilidade</span>
            </Link>
          )}
        </div>

        {isAdmin && (
          <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
            <h3 className='font-light text-[#728297] text-xs px-2 pt-1 uppercase tracking-wider'>GESTÃO</h3>
            <Link to="/cadastroUtilizador" className={getLinkClasses("/cadastroUtilizador")}>
              <LuUsers className={getIconClasses("/cadastroUtilizador")} />
              <span>Utilizadores</span>
            </Link>
            <Link to="/cadastroUniversidade" className={getLinkClasses("/cadastroUniversidade")}>
              <LiaUniversitySolid className={getIconClasses("/cadastroUniversidade")}/>
              <span>Universidades</span>
            </Link>
          </div>
        )}

        <div className='flex flex-col p-3 gap-2 border-b border-white/5'>
          <h3 className='font-light text-[#728297] text-xs px-2 pt-1 uppercase tracking-wider'>DOCUMENTAÇÃO</h3>
          <Link to="/introducao" className={getLinkClasses("/introducao")}>
            <IoBookOutline className={getIconClasses("/introducao")} />
            <span>Introdução</span>
          </Link>
        </div>

        <div className='flex flex-col p-3 mt-auto border-t border-white/5 gap-1'>
          <button
            onClick={() => {
              setShowPasswordModal(true);
              setStatusMsg(null);
            }}
            className='p-2.5 px-4 rounded-md cursor-pointer flex items-center gap-3 text-[#D9A95E] hover:bg-white/10 transition-colors w-full text-left bg-transparent border-none text-sm'
          >
            <FiKey className='h-5 w-5 text-[#D9A95E] shrink-0'/>
            <span>Alterar Senha</span>
          </button>

          <button
            onClick={handleLogout}
            className='p-2.5 px-4 rounded-md cursor-pointer flex items-center gap-3 text-white hover:bg-white/10 hover:text-orange-200 transition-colors w-full text-left bg-transparent border-none'
          >
            <AiOutlineLogin className='h-5 w-5 md:h-6 md:w-6 text-[#FFFFFF] shrink-0'/>
            <span>Sair</span>
          </button>
        </div>
      </aside>

      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl text-gray-800">
            <h4 className="text-xl font-bold text-[#0E284E] mb-4 font-serif">Alterar Minha Palavra-passe</h4>

            {statusMsg && (
              <div
                className={`p-3 mb-4 rounded-md text-sm ${
                  statusMsg.type === 'success'
                    ? 'bg-green-50 border border-green-300 text-green-800'
                    : 'bg-red-50 border border-red-300 text-red-800'
                }`}
              >
                {statusMsg.text}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <Input
                label="Palavra-passe Atual"
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />

              <Input
                label="Nova Palavra-passe"
                type="password"
                placeholder="Mínimo 6 caracteres"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <Input
                label="Confirmar Nova Palavra-passe"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading || !oldPassword || !newPassword}
                  className="px-4 py-2 text-sm bg-[#173764] text-white rounded-md hover:bg-[#0E284E] cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Salvando...' : 'Atualizar Senha'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default Sidebar;