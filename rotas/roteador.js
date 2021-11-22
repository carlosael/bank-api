const express = require("express");
const controladorDeContas = require("../controladores/contas");

const roteador = express();

roteador.get("/contas", controladorDeContas.consultarContas);
roteador.post("/contas", controladorDeContas.criarConta);
roteador.put("/contas/:numeroConta/usuario", controladorDeContas.editarConta);
roteador.delete("/contas/:numeroConta", controladorDeContas.deletarConta);
roteador.post("/transacoes/depositar", controladorDeContas.depositar);
roteador.post("/transacoes/sacar", controladorDeContas.sacar);
roteador.post("/transacoes/transferir", controladorDeContas.transferir);
roteador.get("/contas/saldo", controladorDeContas.consultarSaldo);
roteador.get("/contas/extrato", controladorDeContas.extrato);

module.exports = roteador;