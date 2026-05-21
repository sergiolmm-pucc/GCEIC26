import { Request, Response, NextFunction } from 'express';

// ─────────────────────────────────────────
//  Valida campos numéricos positivos
//  Usado por: ALUNO 1 (peso, distancia) e ALUNO 3 (distanciaKm)
// ─────────────────────────────────────────
export function validarNumeroPositivo(campos: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    for (const campo of campos) {
      const valor = req.body[campo];
      if (valor === undefined || valor === null || valor === '') {
        res.status(400).json({ sucesso: false, erro: `Campo obrigatório: "${campo}"` });
        return;
      }
      const num = Number(valor);
      if (isNaN(num) || num <= 0) {
        res.status(400).json({ sucesso: false, erro: `"${campo}" deve ser um número maior que zero` });
        return;
      }
    }
    next();
  };
}

// ─────────────────────────────────────────
//  Valida o tipo de entrega
//  Usado por: ALUNO 1 (calcular) e ALUNO 3 (prazo)
// ─────────────────────────────────────────
export function validarTipoEntrega(req: Request, res: Response, next: NextFunction): void {
  const tiposValidos = ['economico', 'normal', 'expresso'];
  const { tipo } = req.body;
  if (!tipo) {
    res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "tipo"' });
    return;
  }
  if (!tiposValidos.includes(tipo)) {
    res.status(400).json({ sucesso: false, erro: `"tipo" inválido. Use: ${tiposValidos.join(', ')}` });
    return;
  }
  next();
}

// ─────────────────────────────────────────
//  Valida origem e destino como strings não vazias
//  Usado por: ALUNO 2 (distancia)
// ─────────────────────────────────────────
export function validarCidades(req: Request, res: Response, next: NextFunction): void {
  const { origem, destino } = req.body;
  if (!origem || String(origem).trim() === '') {
    res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "origem"' });
    return;
  }
  if (!destino || String(destino).trim() === '') {
    res.status(400).json({ sucesso: false, erro: 'Campo obrigatório: "destino"' });
    return;
  }
  if (String(origem).trim() === String(destino).trim()) {
    res.status(400).json({ sucesso: false, erro: 'Origem e destino não podem ser iguais' });
    return;
  }
  next();
}
