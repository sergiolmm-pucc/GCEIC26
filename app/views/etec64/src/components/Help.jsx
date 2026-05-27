import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

export default function Help() {
  const faqs = [
    {
      pergunta: 'O que são as Menções ETEC (MB, B, R, I) e qual a equivalência em nota?',
      resposta: 'O Centro Paula Souza adota um sistema de avaliação por conceitos acadêmicos (menções), em vez de apenas notas numéricas decimais. A equivalência padrão aceita academicamente é:\n\n• MB (Muito Bom - Peso 10.0): Indica desempenho excelente e superação plena dos objetivos.\n• B (Bom - Peso 8.0): Indica desempenho plenamente satisfatório.\n• R (Regular - Peso 6.0): Desempenho mínimo aceitável. Limite para aprovação direta.\n• I (Insatisfatório - Peso 4.0): Desempenho insuficiente. Reprovação por nota, exigindo exame de recuperação.'
    },
    {
      pergunta: 'Qual a frequência mínima obrigatória nas ETECs?',
      resposta: 'A legislação nacional e o regulamento do Centro Paula Souza exigem a frequência mínima de 75.0% da carga horária prevista de aulas em cada componente curricular. O não cumprimento dessa regra acarreta na reprovação direta por faltas, sem direito ao exame de recuperação de notas.'
    },
    {
      pergunta: 'É possível ser reprovado mesmo tirando MB em todas as avaliações?',
      resposta: 'Sim. A aprovação exige a combinação de dois critérios independentes: nota (média anual/semestral >= 6.0 ou menção >= R) E presença (frequência >= 75.0%). A reprovação por faltas ocorre mesmo se o aluno tiver conceitos excelentes.'
    },
    {
      pergunta: 'Como funciona a simulação de recuperação final (exame)?',
      resposta: 'Caso o aluno chegue ao final do período acadêmico com presença suficiente (>= 75%) mas nota insatisfatória (< 6.0 ou menção I), ele entra em Recuperação Final. \n\nPara ser aprovado, o aluno deve realizar um exame. A nova média é calculada pela média aritmética entre a Média Atual e a Nota do Exame. O resultado final deve ser igual ou superior a 6.0 (equivalente a menção R). Portanto:\n\nNota Exame Necessária = 12.0 - Média Atual'
    },
    {
      pergunta: 'Como funciona o cálculo de metas para bimestres restantes?',
      resposta: 'O simulador do Aluno C cruza seus dados atuais e calcula o total de pontos necessários para aprovação direta no ano (total de 24 pontos, ou seja, média 6.0 x 4 bimestres). Ele subtrai os pontos obtidos até o momento e divide o saldo pela quantidade de bimestres restantes, gerando a meta exata de notas e presenças necessárias.'
    }
  ];

  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (index) => {
    setActiveFaq(activeFaq === index ? null : index);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Cabeçalho */}
      <div>
        <h2 style={{ fontSize: '1.8rem', color: '#fff', marginBottom: '8px' }}>Ajuda & Regulamento Acadêmico</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Entenda as regras de avaliação, menções de notas, exigências de presença e o funcionamento das recuperações da ETEC.
        </p>
      </div>

      {/* Seção Informativa de Cartão */}
      <div 
        className="glass" 
        style={{
          padding: '24px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          background: 'rgba(37, 99, 235, 0.05)',
          border: '1px solid rgba(37, 99, 235, 0.15)'
        }}
      >
        <BookOpen size={24} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <h4 style={{ color: '#fff', fontSize: '1.05rem' }}>Critério Geral de Aprovação ETEC</h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Para ser considerado <b>APROVADO</b> em qualquer matéria, o aluno precisa simultaneamente alcançar uma <b>Média igual ou superior a 6.0</b> (equivalente às menções R, B ou MB) <b>E</b> uma <b>Frequência igual ou superior a 75%</b> das aulas ministradas.
          </p>
        </div>
      </div>

      {/* Lista de FAQ (Accordion) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className="glass"
            style={{
              padding: '0',
              overflow: 'hidden',
              border: `1px solid ${activeFaq === index ? 'var(--border-glass-active)' : 'var(--border-glass)'}`,
              background: activeFaq === index ? 'rgba(20, 30, 58, 0.4)' : 'rgba(13, 20, 38, 0.4)'
            }}
          >
            {/* Botão de Clique */}
            <button
              onClick={() => toggleFaq(index)}
              style={{
                width: '100%',
                padding: '20px 24px',
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '1.05rem',
                fontWeight: '600',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                gap: '12px'
              }}
            >
              <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <HelpCircle size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                {faq.pergunta}
              </span>
              {activeFaq === index ? (
                <ChevronUp size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              ) : (
                <ChevronDown size={18} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
              )}
            </button>

            {/* Conteúdo Expandido */}
            <div
              style={{
                maxHeight: activeFaq === index ? '500px' : '0',
                transition: 'max-height 0.3s ease-in-out',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{
                  padding: '0 24px 24px 54px',
                  fontSize: '0.92rem',
                  color: 'var(--text-muted)',
                  lineHeight: '1.7',
                  whiteSpace: 'pre-line',
                  borderTop: '1px solid rgba(255, 255, 255, 0.03)',
                  paddingTop: '16px'
                }}
              >
                {faq.resposta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
