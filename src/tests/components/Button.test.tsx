import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';
import Button from '../../components/ui/Button';

describe('Button Component', () => {
  it('deve renderizar o conteúdo do botão corretamente', () => {
    render(<Button>Guardar</Button>);
    expect(screen.getByRole('button', { name: /guardar/i })).toBeInTheDocument();
  });

  it('deve desabilitar o botão quando a prop disabled for verdadeira', () => {
    render(<Button disabled>Anterior</Button>);
    const button = screen.getByRole('button', { name: /anterior/i });
    expect(button).toBeDisabled();
  });

  it('deve permitir evento de clique quando habilitado', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clique Aqui</Button>);
    const button = screen.getByRole('button', { name: /clique aqui/i });
    button.click();
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
