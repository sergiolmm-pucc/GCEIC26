import Navbar from '../components/Navbar'

function Sobre() {
  return (
    <>
      <Navbar />

      <div className="page">
        <h1>Sobre o Projeto</h1>

        <h2>Equipe</h2>
        <div className="sobre-grid">
          <div className="sobre-card">
            <div className="label">Desenvolvedor</div>
            <div className="value">Caiuã Vieira</div>
          </div>
          <div className="sobre-card">
            <div className="label">Desenvolvedor</div>
            <div className="value">Mateus Mergulhão</div>
          </div>
           <div className="sobre-card">
            <div className="label">Desenvolvedor</div>
            <div className="value">Marcelo França</div>
          </div>
        </div>

        <h2 style={{ marginTop: '28px' }}>Tecnologias</h2>
        <div className="sobre-grid">
          <div className="sobre-card">
            <div className="label">Frontend</div>
            <div className="value">React + Vite</div>
          </div>
          <div className="sobre-card">
            <div className="label">Backend</div>
            <div className="value">Node.js + Express</div>
          </div>
          <div className="sobre-card">
            <div className="label">Testes</div>
            <div className="value">Jest + Supertest</div>
          </div>
          <div className="sobre-card">
            <div className="label">HTTP Client</div>
            <div className="value">Axios</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Sobre