import React from 'react'
import Navbar from '../components/Navbar'

function Sobre() {
  return (
    <>
      <Navbar />
      
      <div className="container" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '10px' }}>Sobre o Projeto</h1>
        
        {/* Descrição do Projeto / API */}
        <section style={{ marginBottom: '30px', backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px' }}>
          <h2>Do que se trata o projeto?</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#333' }}>
            Nossa aplicação é voltada para a gestão financeira e estratégica de negócios, focando essencialmente no 
            <strong> Cálculo de MarkUp</strong>. A API desenvolvida em Node.js processa os dados de custos estruturais, 
            despesas (fixas e variáveis) e a margem de lucro desejada para retornar o índice multiplicador ideal. 
            Com isso, o sistema permite determinar de forma precisa e automatizada o preço de venda competitivo de um produto, 
            garantindo a sustentabilidade financeira da empresa.
          </p>
        </section>

        {/* Foto da Equipe */}
        <div className="equipe-container" style={{ text_align: 'center', margin: '30px auto', maxWidth: '550px' }}>
          <img 
            src="/equipe.jpeg" 
            alt="Foto da Equipe" 
            style={{ 
              width: '100%', 
              height: 'auto', 
              borderRadius: '12px', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)' 
            }} 
          />
        </div>

        {/* Divisão de Tarefas / Integrantes */}
        <section style={{ marginTop: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Desenvolvedores e Contribuições</h2>
          <p style={{ textAlign: 'center', fontStyle: 'italic', color: '#666', marginBottom: '20px' }}>
            Cumprindo os requisitos do projeto, cada integrante da equipe ficou responsável pelo desenvolvimento e implementação de um dos 3 cálculos que compõem o nosso ecossistema de APIs:
          </p>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginTop: '10px' }}>
            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Caiua Vieira</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>Responsável pela arquitetura base e desenvolvimento do cálculo de despesas fixas e variáveis no fluxo do MarkUp.</p>
            </div>

            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Marcelo Oliveira</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>Responsável pela lógica matemática central da API e validação dos parâmetros de margem de lucro pretendida.</p>
            </div>

            <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', textAlign: 'center', backgroundColor: '#fff' }}>
              <h4 style={{ margin: '0 0 10px 0', color: '#007bff' }}>Mateus Mergulhao</h4>
              <p style={{ fontSize: '0.9rem', color: '#555', margin: 0 }}>Responsável pelo processamento do custo unitário do produto e integração final dos fatores de conversão do preço de venda.</p>
            </div>
          </div>
        </section>

        <footer style={{ marginTop: '40px', textAlign: 'center', fontSize: '0.9rem', color: '#969696' }}>
          <p>Disciplina: GCEIC26 - Engenharia de Software | PUC-Campinas</p>
        </footer>
      </div>
    </>
  )
}

export default Sobre