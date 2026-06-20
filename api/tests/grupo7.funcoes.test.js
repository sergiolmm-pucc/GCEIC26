/**
 * Testes Unitários das Funções - Sistema de Cálculo de Piscinas
 * Grupo 7
 */


const {
    calcularVolume,
    calcularMateriais,
    calcularCustos
} = require('../src/equipe-7/funcoes');



describe('SISTEMA DE CÁLCULO DE PISCINAS - TESTES DE FUNÇÕES GRUPO 7', () => {



    test('Deve calcular volume corretamente', () => {


        const resultado = calcularVolume(
            2,
            4,
            2
        );


        expect(resultado)
            .toBe("16.00");


    });





    test('Não deve aceitar volume negativo', () => {


        expect(() => {

            calcularVolume(
                -2,
                4,
                2
            );


        }).toThrow();


    });






    test('Deve calcular custo dos materiais corretamente', () => {


        const resultado = calcularMateriais(
            150,
            200
        );


        expect(resultado)
            .toBe("350.00");


    });






    test('Não deve aceitar materiais negativos', () => {


        expect(() => {

            calcularMateriais(
                -100,
                200
            );


        }).toThrow();


    });






    test('Deve calcular custos de água e manutenção', () => {


        const resultado = calcularCustos(
            10,
            5,
            2
        );


        expect(resultado.custoAgua)
            .toBe("50.00");


        expect(resultado.custoManutencao)
            .toBe("20.00");


    });



});