import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
      <nav style={{ marginBottom: '2rem' }}>
        <Link to="/calculadora" style={{ textDecoration: 'none', color: '#007bff' }}>&larr; Voltar para Calculadora</Link>
      </nav>
      
      <h2>Ajuda e Instruções de Uso</h2>
      <p style={{ color: '#555', marginBottom: '2rem' }}>
        Veja abaixo como utilizar a Calculadora de Custos de Sauna:
      </p>

      <ul style={{ lineHeight: '1.8', backgroundColor: '#f9f9f9', padding: '1.5rem 2.5rem', borderRadius: '8px' }}>
        <li style={{ marginBottom: '1rem' }}>
          <strong>Tipo de Sauna:</strong> Selecione se a sauna será Úmida (a vapor) ou Seca (finlandesa). O sistema usa essa informação para decidir entre revestimento de pastilha ou madeira, além do tipo de aquecedor.
        </li>
        <li style={{ marginBottom: '1rem' }}>
          <strong>Dimensões:</strong> Insira a largura, comprimento e altura do cômodo em metros. O sistema calculará a área total de revestimento e o volume interno automaticamente.
        </li>
        <li>
          <strong>Cálculo Final:</strong> Ao clicar em "Calcular Custos", o aplicativo fará o processamento dos dados e listará os custos estimados com materiais, gerador de calor e a manutenção mensal (energia elétrica).
        </li>
      </ul>

      <div style={{ marginTop: '2rem', padding: '1rem', borderLeft: '4px solid #ffc107', backgroundColor: '#fffbe6' }}>
        <strong>Nota Técnica:</strong> Se os resultados não aparecerem, verifique se as APIs Node.js estão ativas no servidor e se a sua conexão com a internet está estável.
      </div>
    </div>
  );
}