function calcularVolume(largura, comprimento, profundidade){

    return largura * comprimento * profundidade;

}



function calcularMateriais(eletrico, hidraulico){

    return eletrico + hidraulico;

}



function calcularCustos(volume, agua, manutencao){


    return {

        custoAgua: volume * agua,

        custoManutencao: volume * manutencao

    }

}



module.exports = {

    calcularVolume,
    calcularMateriais,
    calcularCustos

};