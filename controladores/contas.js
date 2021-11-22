const data = require("../src/bancodedados");
const { format } = require("date-fns");

function consultarContas(req, res) {
    const contas = data.contas;
    if (req.query.senha_banco === "Cubos123Bank") {
        res.status(200).json(contas);
    } else {
        res.status(401).json({ mensagem: "A senha do banco informada é inválida!" });
    }
}

let numeroDeContas = 1;

function validandoEntrada(req, res) {
    if (!req.body.nome) { return res.status(400).json({ mensagem: "O campo 'nome' é obrigatório." }); }

    if (!req.body.cpf) { return res.status(400).json({ mensagem: "O campo 'cpf' é obrigatório." }); }

    if (!req.body.data_nascimento) { return res.status(400).json({ mensagem: "O campo 'data_nascimento' é obrigatório." }); }

    if (!req.body.telefone) { return res.status(400).json({ mensagem: "O campo 'telefone' é obrigatório." }); }

    if (!req.body.email) { return res.status(400).json({ mensagem: "O campo 'email' é obrigatório." }); }

    if (!req.body.senha) { return res.status(400).json({ mensagem: "O campo 'senha' é obrigatório." }); }
}

function criarConta(req, res) {
    validandoEntrada(req, res);

    const cpfEncontrado = data.contas.find(
        (conta) => conta.usuario.cpf === req.body.cpf
    );

    if (cpfEncontrado) { return res.status(400).json({ mensagem: "Usuário já cadastrado." }); }

    const emailEcontrado = data.contas.find(
        (conta) => conta.usuario.email === req.body.email
    );

    if (emailEcontrado) { return res.status(400).json({ mensagem: "Usuário já cadastrado." }); }

    const novaConta = {
        numero: `${numeroDeContas}`,
        saldo: 0,
        usuario: {
            nome: req.body.nome,
            cpf: req.body.cpf,
            data_nascimento: req.body.data_nascimento,
            telefone: req.body.telefone,
            email: req.body.email,
            senha: req.body.senha
        }
    };

    data.contas.push(novaConta);

    numeroDeContas++;

    res.json().status(200)
}

function editarConta(req, res) {
    let apenasNumeros = /^[0-9]$/;
    if (apenasNumeros.test(req.params.numeroConta)) {
        validandoEntrada(req, res);
        const contaEncontrada = data.contas.find(
            (account) => account.numero === req.params.numeroConta
        );

        if (contaEncontrada) {
            if (contaEncontrada.usuario.cpf === req.body.cpf) {
                if (contaEncontrada.usuario.email === req.body.email) {
                    contaEncontrada.usuario.nome = req.body.nome;
                    contaEncontrada.usuario.cpf = req.body.cpf;
                    contaEncontrada.usuario.data_nascimento = req.body.data_nascimento;
                    contaEncontrada.usuario.telefone = req.body.telefone;
                    contaEncontrada.usuario.email = req.body.email;
                    contaEncontrada.usuario.senha = req.body.senha;
                    return res.status(204).json();
                } else {
                    const emailEcontrado = data.contas.find(
                        (conta) => conta.usuario.email === req.body.email
                    );
                    if (emailEcontrado) {
                        return res.status(400).json({ mensagem: "E-mail informado já cadastrado em outro usuário." });
                    } else {
                        contaEncontrada.usuario.nome = req.body.nome;
                        contaEncontrada.usuario.cpf = req.body.cpf;
                        contaEncontrada.usuario.data_nascimento = req.body.data_nascimento;
                        contaEncontrada.usuario.telefone = req.body.telefone;
                        contaEncontrada.usuario.email = req.body.email;
                        contaEncontrada.usuario.senha = req.body.senha;
                        return res.status(204).json();
                    }
                }
            } else {
                const cpfEncontrado = data.contas.find(
                    (conta) => conta.usuario.cpf === req.body.cpf
                );
                if (cpfEncontrado) {
                    return res.status(400).json({ mensagem: "CPF informado já cadastrado em outro usuário." });
                } else {
                    if (contaEncontrada.usuario.email === req.body.email) {
                        contaEncontrada.usuario.nome = req.body.nome;
                        contaEncontrada.usuario.cpf = req.body.cpf;
                        contaEncontrada.usuario.data_nascimento = req.body.data_nascimento;
                        contaEncontrada.usuario.telefone = req.body.telefone;
                        contaEncontrada.usuario.email = req.body.email;
                        contaEncontrada.usuario.senha = req.body.senha;
                        return res.status(204).json();
                    } else {
                        const emailEcontrado = data.contas.find(
                            (conta) => conta.usuario.email === req.body.email
                        );
                        if (emailEcontrado) {
                            return res.status(400).json({ mensagem: "E-mail informado já cadastrado em outro usuário." });
                        } else {
                            contaEncontrada.usuario.nome = req.body.nome;
                            contaEncontrada.usuario.cpf = req.body.cpf;
                            contaEncontrada.usuario.data_nascimento = req.body.data_nascimento;
                            contaEncontrada.usuario.telefone = req.body.telefone;
                            contaEncontrada.usuario.email = req.body.email;
                            contaEncontrada.usuario.senha = req.body.senha;
                            return res.status(204).json();
                        }
                    }
                }
            }
        } else {
            res.status(400).json({ mensagem: "Não existe conta a ser substituída para o número informado." })
        }
    } else {
        res.status(400).json({ mensagem: "O número da conta deve ser um número válido." });
    }
}

function deletarConta(req, res) {
    let apenasNumeros = /^[0-9]$/;
    if (apenasNumeros.test(req.params.numeroConta)) {
        const contaEncontrada = data.contas.find(
            (account) => account.numero === req.params.numeroConta
        );
        if (contaEncontrada) {
            if (contaEncontrada.saldo > 0) {
                res.status(400).json({ mensagem: "A conta precisa estar com saldo zerado para ser deletada." });
            } else {
                const indiceDaContaDeletada = data.contas.indexOf(contaEncontrada);
                data.contas.splice(indiceDaContaDeletada, 1);
                res.status(204).json()
            }
        } else {
            res.status(404).json({ mensagem: "Esta conta não foi encontrada" });
        }
    } else {
        res.status(400).json({ mensagem: "o número da conta deve ser um número válido." });
    }
}

let saldo = 0;

function depositar(req, res) {
    if (!req.body.numero_conta && !req.body.valor) {
        return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
    }

    const contaEncontrada = data.contas.find(
        (conta) => conta.numero === req.body.numero_conta
    );
    if (contaEncontrada) {
        if (req.body.valor <= 0) {
            return res.status(400).json({ mensagem: "O número da conta e o valor são obrigatórios!" });
        }

        const deposit = {
            data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
            numero_conta: req.body.numero_conta,
            valor: req.body.valor
        }

        data.depositos.push(deposit);

        const newBalance = contaEncontrada.saldo + req.body.valor;

        contaEncontrada.saldo = newBalance;

        res.status(204).json();

    } else {
        res.status(400).json({ mensagem: "Esta conta não foi encontrada" });
    }
}

function sacar(req, res) {
    if (!req.body.numero_conta) { return res.status(400).json({ mensagem: "O campo 'numero_conta' é obrigatório." }); }

    if (!req.body.valor) { return res.status(400).json({ mensagem: "O campo 'valor' é obrigatório." }); }

    if (!req.body.senha) { return res.status(400).json({ mensagem: "O campo 'senha' é obrigatório." }); }

    if (req.body.valor > 0) {
        const contaEncontrada = data.contas.find(
            (conta) => conta.numero === req.body.numero_conta
        );
        if (contaEncontrada) {
            if (contaEncontrada.usuario.senha !== req.body.senha) {
                return res.status(400).json({ mensagem: "Senha inválida." });
            } else {
                if (contaEncontrada.saldo < req.body.valor) {
                    return res.status(400).json({ mensagem: "Saldo insulficiente." });
                } else {
                    const newBalance = contaEncontrada.saldo - req.body.valor;
                    contaEncontrada.saldo = newBalance;

                    const withdraw = {
                        data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                        numero_conta: req.body.numero_conta,
                        valor: req.body.valor
                    }
                    data.saques.push(withdraw);

                    res.status(204).json();
                }
            }
        }
    } else {
        return res.status(400).json({ mensagem: "O valor não pode ser menor que zero!" });
    }
}

function transferir(req, res) {
    if (!req.body.numero_conta_origem) { return res.status(400).json({ mensagem: "O campo 'numero_conta_origem' é obrigatório." }); }

    if (!req.body.numero_conta_destino) { return res.status(400).json({ mensagem: "O campo 'numero_conta_destino' é obrigatório." }); }

    if (!req.body.senha) { return res.status(400).json({ mensagem: "O campo 'senha' é obrigatório." }); }

    if (!req.body.valor) { return res.status(400).json({ mensagem: "O campo 'valor' é obrigatório." }); }

    const contaOrigem = data.contas.find(
        (conta) => conta.numero === req.body.numero_conta_origem
    );

    const contaDestino = data.contas.find(
        (conta) => conta.numero === req.body.numero_conta_destino
    );
    if (contaOrigem && contaDestino) {
        if (contaOrigem.usuario.senha !== req.body.senha) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        } else {
            if (contaOrigem.saldo < req.body.valor) {
                return res.status(400).json({ mensagem: "Saldo insulficiente." });
            } else {
                const novoSaldoContaOrigem = contaOrigem.saldo - req.body.valor;
                contaOrigem.saldo = novoSaldoContaOrigem;

                const novoSaldoContaDestino = contaDestino.saldo + req.body.valor;
                contaDestino.saldo = novoSaldoContaDestino;

                const transferencia = {
                    data: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
                    numero_conta_origem: req.body.numero_conta_origem,
                    numero_conta_destino: req.body.numero_conta_destino,
                    valor: req.body.valor
                }
                data.transferencias.push(transferencia);
                console.log(transferencia)

                res.status(204).json();
            }
        }
    } else {
        return res.status(400).json({ mensagem: "Não foi possível localizar as contas informadas." });
    }
}

function consultarSaldo(req, res) {
    if (!req.query.numero_conta) { return res.status(400).json({ mensagem: "O campo 'numero_conta' é obrigatório." }); }

    if (!req.query.senha) { return res.status(400).json({ mensagem: "O campo 'senha' é obrigatório." }); }

    const contaEncontrada = data.contas.find(
        (conta) => conta.numero === req.query.numero_conta
    );

    if (contaEncontrada) {
        if (contaEncontrada.usuario.senha !== req.query.senha) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        } else {
            res.status(200).json({ saldo: contaEncontrada.saldo });
        }
    } else {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
    }
}

function extrato(req, res) {
    if (!req.query.numero_conta) { return res.status(400).json({ mensagem: "O campo 'numero_conta' é obrigatório." }); }

    if (!req.query.senha) { return res.status(400).json({ mensagem: "O campo 'senha' é obrigatório." }); }

    const contaEncontrada = data.contas.find(
        (account) => account.numero === req.query.numero_conta
    );

    if (contaEncontrada) {
        if (contaEncontrada.usuario.senha !== req.query.senha) {
            return res.status(400).json({ mensagem: "Senha inválida." });
        } else {
            const transferenciasRecebidas = data.transferencias.filter(transferencia => transferencia.numero_conta_destino === contaEncontrada.numero);

            const transferenciasEnviadas = data.transferencias.filter(transferencia => transferencia.numero_conta_origem === contaEncontrada.numero);

            const depositosFeitos = data.depositos.filter(deposito => deposito.numero_conta === contaEncontrada.numero);

            const saquesFeitos = data.saques.filter(saque => saque.numero_conta === contaEncontrada.numero);



            res.status(200).json({
                depositos: depositosFeitos,
                saques: saquesFeitos,
                transferenciasEnviadas,
                transferenciasRecebidas
            });
        }
    } else {
        return res.status(400).json({ mensagem: "Conta bancária não encontada!" });
    }
}

module.exports = {
    consultarContas,
    criarConta,
    editarConta,
    deletarConta,
    depositar,
    sacar,
    transferir,
    consultarSaldo,
    extrato
}