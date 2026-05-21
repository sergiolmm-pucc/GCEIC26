import { Request, Response } from 'express';
import * as FreteService from '../services/frete.service';
import { ApiResponse, FreteOutput, DistanciaOutput, PrazoOutput } from '../types/frete.types';

// ══════════════════════════════════════════
//  ALUNO 1 — POST /frete/calcular
// ══════════════════════════════════════════
export function ctrlCalcular(req: Request, res: Response): void {
  try {
    const dados = FreteService.calcularFrete({
      peso:      Number(req.body.peso),
      distancia: Number(req.body.distancia),
      tipo:      req.body.tipo,
    });
    const resp: ApiResponse<FreteOutput> = { sucesso: true, dados };
    res.status(200).json(resp);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    res.status(400).json({ sucesso: false, erro: msg });
  }
}

// ══════════════════════════════════════════
//  ALUNO 2 — POST /frete/distancia
//            GET  /frete/distancia/cidades
// ══════════════════════════════════════════
export function ctrlDistancia(req: Request, res: Response): void {
  try {
    const dados = FreteService.calcularDistancia({
      origem:  String(req.body.origem ?? '').trim(),
      destino: String(req.body.destino ?? '').trim(),
    });
    const resp: ApiResponse<DistanciaOutput> = { sucesso: true, dados };
    res.status(200).json(resp);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    res.status(400).json({ sucesso: false, erro: msg });
  }
}

export function ctrlListarCidades(_req: Request, res: Response): void {
  const dados = FreteService.listarCidades();
  res.status(200).json({ sucesso: true, dados });
}

// ══════════════════════════════════════════
//  ALUNO 3 — POST /frete/prazo
// ══════════════════════════════════════════
export function ctrlPrazo(req: Request, res: Response): void {
  try {
    const dados = FreteService.calcularPrazo({
      distanciaKm: Number(req.body.distanciaKm),
      tipo:        req.body.tipo,
    });
    const resp: ApiResponse<PrazoOutput> = { sucesso: true, dados };
    res.status(200).json(resp);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Erro interno';
    res.status(400).json({ sucesso: false, erro: msg });
  }
}
