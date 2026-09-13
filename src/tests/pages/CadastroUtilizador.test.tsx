import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CadastroUtilizador from '../../pages/CadastroUtilizador';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('CadastroUtilizador Page Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'fake-jwt-token');
  });

  it('deve carregar a lista de utilizadores e os controles de formulário', async () => {
    const mockUsers = [
      {
        id: 'u-1',
        nome: 'Maria Santos',
        email: 'maria@uporto.pt',
        perfil: 'GESTOR_MOBILIDADE',
        university: { id: 'uni-1', nome: 'Universidade do Porto' },
      },
    ];

    mockedAxios.get.mockImplementation((url: string) => {
      if (url.includes('/user')) {
        return Promise.resolve({ data: mockUsers });
      }
      return Promise.resolve({ data: [] });
    });

    render(
      <MemoryRouter>
        <CadastroUtilizador />
      </MemoryRouter>
    );

    expect(screen.getByText('Novo Utilizador')).toBeInTheDocument();
    expect(screen.getByText('Utilizadores')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('maria@uporto.pt')).toBeInTheDocument();
    });
  });
});
