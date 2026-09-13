import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import CadastroUniversidades from '../../pages/CadastroUniversidades';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = vi.mocked(axios);

describe('CadastroUniversidades Page Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('token', 'fake-jwt-token');
  });

  it('deve carregar e exibir a lista de universidades parceiras', async () => {
    const universities = [
      { id: '1', nome: 'Universidade de Lisboa', pais: 'Portugal' },
      { id: '2', nome: 'Universidade do Porto', pais: 'Portugal' },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: universities });

    render(
      <MemoryRouter>
        <CadastroUniversidades />
      </MemoryRouter>
    );

    expect(screen.getByText('Adicionar Universidade')).toBeInTheDocument();
    expect(screen.getByText('Universidades Parceiras')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Universidade de Lisboa')).toBeInTheDocument();
      expect(screen.getByText('Universidade do Porto')).toBeInTheDocument();
    });
  });
});
