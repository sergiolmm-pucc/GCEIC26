/**
 * Testes de Integração da API - Sistema de Cálculo de Piscinas
 * Grupo 7
 */

const request = require('supertest');
const express = require('express');

const volumeRoutes = require('../src/equipe-7/volume');
const materiaisRoutes = require('../src/equipe-7/materiais');
const custosRoutes = require('../src/equipe-7/custos');

const app = express();

app.use(express.json());


app.use('/api/equipe-7/volume', volumeRoutes);
app.use('/api/equipe-7/materiais', materiaisRoutes);
app.use('/api/equipe-7/custos', custosRoutes);



describe('SISTEMA DE CÁLCULO DE PISCINAS - TESTES DE API GRUPO 7', () => {



    // ============================================
    // VOLUME
    // ============================================


    describe('POST /api/equipe-7/volume/calcular', () => {


        test('Deve calcular volume da piscina corretamente', async () => {

            const res = await request(app)
                .post('/api/equipe-7/volume/calcular')
                .send({
                    largura:2,
                    comprimento:4,
                    profundidade:2
                });


            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.volume).toBe("16.00");

        });



        test('Não deve aceitar valores negativos no volume', async () => {

            const res = await request(app)
                .post('/api/equipe-7/volume/calcular')
                .send({
                    largura:-2,
                    comprimento:4,
                    profundidade:2
                });


            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);

        });



        test('Não deve aceitar texto no volume', async () => {

            const res = await request(app)
                .post('/api/equipe-7/volume/calcular')
                .send({
                    largura:"abc",
                    comprimento:4,
                    profundidade:2
                });


            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);

        });


    });





    // ============================================
    // MATERIAIS
    // ============================================


    describe('POST /api/equipe-7/materiais/calcular', () => {



        test('Deve calcular materiais elétricos e hidráulicos corretamente', async () => {


            const res = await request(app)
                .post('/api/equipe-7/materiais/calcular')
                .send({
                    precoEletrico:150,
                    precoHidraulico:200
                });


            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.custoMateriais).toBe("350.00");


        });





        test('Deve aceitar valores numéricos enviados como string', async () => {


            const res = await request(app)
                .post('/api/equipe-7/materiais/calcular')
                .send({
                    precoEletrico:"150",
                    precoHidraulico:"200"
                });



            expect(res.statusCode).toBe(200);
            expect(res.body.custoMateriais).toBe("350.00");


        });






        test('Não deve aceitar custo de materiais negativo', async () => {


            const res = await request(app)
                .post('/api/equipe-7/materiais/calcular')
                .send({
                    precoEletrico:-150,
                    precoHidraulico:200
                });



            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);


        });






        test('Não deve aceitar custo de materiais nulo', async () => {


            const res = await request(app)
                .post('/api/equipe-7/materiais/calcular')
                .send({
                    precoEletrico:null,
                    precoHidraulico:200
                });



            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);


        });






        test('Não deve aceitar texto no custo dos materiais', async () => {


            const res = await request(app)
                .post('/api/equipe-7/materiais/calcular')
                .send({
                    precoEletrico:"abc",
                    precoHidraulico:200
                });



            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);


        });



    });








    // ============================================
    // CUSTOS
    // ============================================


    describe('POST /api/equipe-7/custos/calcular', () => {



        test('Deve calcular custo de água e manutenção corretamente', async () => {


            const res = await request(app)
                .post('/api/equipe-7/custos/calcular')
                .send({

                    volume:10,
                    precoAgua:5,
                    precoManutencao:2

                });



            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);

            expect(res.body.custoAgua)
                .toBe("50.00");

            expect(res.body.custoManutencao)
                .toBe("20.00");


        });






        test('Não deve aceitar volume negativo', async () => {


            const res = await request(app)
                .post('/api/equipe-7/custos/calcular')
                .send({

                    volume:-10,
                    precoAgua:5,
                    precoManutencao:2

                });



            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);


        });






        test('Não deve aceitar texto nos custos', async () => {


            const res = await request(app)
                .post('/api/equipe-7/custos/calcular')
                .send({

                    volume:"teste",
                    precoAgua:5,
                    precoManutencao:2

                });



            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);


        });



    });



});