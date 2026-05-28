import { useState } from 'react';

export function Sobre() {
  const [imageError, setImageError] = useState(false);
  const teamImageUrl = `${import.meta.env.BASE_URL}equipe.jpg`;

  return (
    <section className="page-stack">
      <header className="page-header">
        <p className="eyebrow">Equipe</p>
        <h1>Sobre o projeto</h1>
        <p>
          Projeto desenvolvido pela equipe ETEC para demonstrar API, app React,
          testes e CI/CD.
        </p>
      </header>

      <div className="about-grid">
        <div className="team-photo">
          {!imageError ? (
            <img src={teamImageUrl} alt="Equipe ETEC" onError={() => setImageError(true)} />
          ) : (
            <div className="photo-placeholder">Equipe ETEC</div>
          )}
        </div>
        <div className="text-panel">
          <h2>Integrantes</h2>
          <ul>
            <li>Diogo Bertozi - API de salario mensal</li>
            <li>Bruna Rodrigues Cardoso - API de ferias</li>
            <li>Isaac Bertonha - API de rescisao</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
