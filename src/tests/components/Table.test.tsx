import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom';
import Table, { type Column } from '../../components/Table';

type SampleData = {
  id: string;
  nome: string;
  pais: string;
};

describe('Table Component Unit Tests', () => {
  const columns: Column<SampleData>[] = [
    { header: 'NOME', accessor: 'nome' },
    { header: 'PAÍS', accessor: 'pais' },
  ];

  it('deve renderizar dados da tabela e cabeçalhos corretamente', () => {
    const data: SampleData[] = [
      { id: '1', nome: 'U. Lisboa', pais: 'Portugal' },
      { id: '2', nome: 'U. Porto', pais: 'Portugal' },
    ];

    render(<Table columns={columns} data={data} itemsPerPage={8} />);

    expect(screen.getByText('NOME')).toBeInTheDocument();
    expect(screen.getByText('PAÍS')).toBeInTheDocument();
    expect(screen.getByText('U. Lisboa')).toBeInTheDocument();
    expect(screen.getByText('U. Porto')).toBeInTheDocument();
  });

  it('deve renderizar mensagem de "Nenhum registo encontrado" quando lista vazia', () => {
    render(<Table columns={columns} data={[]} itemsPerPage={8} />);
    expect(screen.getByText('Nenhum registo encontrado.')).toBeInTheDocument();
  });
});
