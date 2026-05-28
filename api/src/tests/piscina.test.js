const request = require('supertest');
const app = require('../app');

describe('Testes da API Calculadora de Piscina', () => {

    describe('POST /api/equipe-08/piscina/volume', () => {
        it('deve calcular o volume corretamente em m3 e litros', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/volume')
                .send({
                    largura: 3,
                    comprimento: 5,
                    profundidade: 1.5
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('volumeMetrosCubicos', 22.5);
            expect(res.body).toHaveProperty('volumeLitros', 22500);
        });

        it('deve retornar erro 400 se faltar algum parâmetro', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/volume')
                .send({
                    largura: 3
                    // Falta comprimento e profundidade
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('erro');
        });
    });

    describe('POST /api/equipe-08/piscina/agua', () => {
        it('deve calcular o custo da água corretamente', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/agua')
                .send({
                    volumeMetrosCubicos: 22.5,
                    precoMetroCubico: 15.5
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('custoAgua', 348.75); // 22.5 * 15.5
        });

        it('deve retornar erro 400 se faltar algum parâmetro na água', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/agua')
                .send({
                    volumeMetrosCubicos: 22.5
                });

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty('erro');
        });
    });

    describe('POST /api/equipe-08/piscina/materiais', () => {
        it('deve calcular o custo de materiais corretamente', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/materiais')
                .send({
                    volumeMetrosCubicos: 20,
                    tipoAcabamento: 'vinil'
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('custoMateriais', 19200);
        });
    });

    describe('POST /api/equipe-08/piscina/manutencao', () => {
        it('deve calcular o custo de manutencao corretamente', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/manutencao')
                .send({
                    volumeMetrosCubicos: 20,
                    meses: 6
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('custoManutencao', 960);
        });
    });

    describe('POST /api/equipe-08/piscina/mao-de-obra', () => {
        it('deve calcular o custo de mao de obra corretamente', async () => {
            const res = await request(app)
                .post('/api/equipe-08/piscina/mao-de-obra')
                .send({
                    diasEstimados: 10,
                    trabalhadores: 3,
                    valorDiaria: 150
                });

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('custoMaoDeObra', 4500);
        });
    });
});