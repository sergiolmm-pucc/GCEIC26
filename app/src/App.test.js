import { render, screen } from '@testing-library/react';
import App from './App';

test('renderiza o título principal do projeto FINV', () => {
  render(<App />);
  
  const tituloElement = screen.getByText(/FINV/i);
  
  expect(tituloElement).toBeInTheDocument();
});