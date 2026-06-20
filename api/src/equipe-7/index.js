const volumeRouter = require('./volume');
const materiaisRouter = require('./materiais');
const custosRouter = require('./custos');

module.exports = {
    calcularVolume: volumeRouter.calcularVolume,
    calcularMateriais: materiaisRouter.calcularMateriais,
    calcularCustos: custosRouter.calcularCustos
};