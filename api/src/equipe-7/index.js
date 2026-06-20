const volumeRouter = require('./volume');
const materiaisRouter = require('./materiais');
const custosRouter = require('./custos');

// Exporta as funções puras extraídas dos roteadores para satisfazer o teste unitário
module.exports = {
    calcularVolume: volumeRouter.calcularVolume,
    calcularMateriais: materiaisRouter.calcularMateriais,
    calcularCustos: custosRouter.calcularCustos
};