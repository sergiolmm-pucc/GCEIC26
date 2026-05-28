function roundMoney(value) {
  return Math.round(Number(value) * 100 + 1e-6) / 100;
}

module.exports = { roundMoney };
