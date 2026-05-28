export function Help() {
  return (
    <section className="page-stack narrow">
      <header className="page-header">
        <p className="eyebrow">Ajuda</p>
        <h1>Como usar</h1>
      </header>
      <div className="text-panel">
        <p>
          Escolha um calculo no menu, preencha os campos numericos e clique em
          calcular. O resultado mostra os principais valores usados no relatorio.
        </p>
        <p>
          O login e fixo para a atividade: usuario <strong>admin</strong> e senha{' '}
          <strong>admin</strong>.
        </p>
        <p>
          As tabelas foram cadastradas para 2026 e devem ser revisadas caso o
          professor solicite outro ano-base.
        </p>
      </div>
    </section>
  );
}
