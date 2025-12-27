// BANCO DE DADOS DE ALUNOS COM MÚLTIPLOS NOMES SIMILARES
const bancoDeAlunos = [
    // JOÃO 1
    {
        nome: "JOÃO PEDRO PANTOJA RABELO",
        cpf: "080.023.542-81",
        matricula: "20240001",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2026"]
    },
    
    // JOÃO 2
    {
        nome: "JOÃO CARLOS SILVA SANTOS",
        cpf: "111.222.333-44",
        matricula: "20240002",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 2 (8º-9º ano)",
        notas: {
            fase1: { nota: 15.0, acertos: 15, posicao: "Classificado" },
            fase2: { nota: 35.0, acertos: 5, posicao: "Aguardando" },
            simulados: { nota: 75.0, media_turma: 72.5 },
            treinamentos: { nota: 85.0, participacao: "90%" }
        },
        premiacoes: ["Menção Honrosa 2025"]
    },
    
    // JOÃO 3
    {
        nome: "JOÃO VITOR OLIVEIRA",
        cpf: "222.333.444-55",
        matricula: "20240003",
        escola: "Colégio Estadual São Paulo",
        nivel: "Nível 1 (6º-7º ano)",
        notas: {
            fase1: { nota: 12.0, acertos: 12, posicao: "Classificado" },
            fase2: { nota: 28.0, acertos: 4, posicao: "Aguardando" },
            simulados: { nota: 68.0, media_turma: 65.0 },
            treinamentos: { nota: 78.0, participacao: "85%" }
        },
        premiacoes: []
    },
    
    // RYAN 1
    {
        nome: "RYAN PETTERSON NUNES BORGES",
        cpf: "131.221.334-58",
        matricula: "20240099",
        escola: "Escola Estadual Rivanda Nazare Da Silva Guimaraes",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2026"]
    },
    
    // RYAN 2
    {
        nome: "RYAN COSTA DE SOUSA",
        cpf: "333.444.555-66",
        matricula: "20240098",
        escola: "Escola Municipal Professora Ana",
        nivel: "Nível 2 (8º-9º ano)",
        notas: {
            fase1: { nota: 16.0, acertos: 16, posicao: "Classificado" },
            fase2: { nota: 38.0, acertos: 5, posicao: "Aguardando" },
            simulados: { nota: 80.0, media_turma: 72.5 },
            treinamentos: { nota: 88.0, participacao: "95%" }
        },
        premiacoes: ["Medalha de Prata 2025"]
    },
    
    // RYAN 3
    {
        nome: "RYAN GABRIEL MARTINS",
        cpf: "444.555.666-77",
        matricula: "20240097",
        escola: "Instituto Federal de Educação",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 20.0, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 45.0, acertos: 7, posicao: "Aguardando" },
            simulados: { nota: 89.0, media_turma: 72.5 },
            treinamentos: { nota: 94.0, participacao: "98%" }
        },
        premiacoes: ["Medalha de Ouro 2025", "Menção Honrosa 2024"]
    },
    
    // OUTROS ALUNOS PARA TESTE
    {
        nome: "MARIA EDUARDA LIMA",
        cpf: "555.666.777-88",
        matricula: "20240004",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 22.0, acertos: 22, posicao: "Classificado" },
            fase2: { nota: 48.0, acertos: 7, posicao: "Aguardando" },
            simulados: { nota: 92.0, media_turma: 72.5 },
            treinamentos: { nota: 96.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2025", "Medalha de Prata 2024"]
    },
    
    {
        nome: "PEDRO HENRIQUE ALVES",
        cpf: "666.777.888-99",
        matricula: "20240005",
        escola: "Colégio Militar",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 19.0, acertos: 19, posicao: "Classificado" },
            fase2: { nota: 41.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 87.0, media_turma: 72.5 },
            treinamentos: { nota: 91.0, participacao: "97%" }
        },
        premiacoes: ["Medalha de Bronze 2025"]
    }
];

// FORMATAÇÃO DE CPF
document.getElementById('cpfAluno').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) value = value.substring(0, 11);
    
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    e.target.value = value;
});

// FUNÇÃO PRINCIPAL DE BUSCA
function buscarNotas() {
    const nomeDigitado = document.getElementById('nomeAluno').value.trim();
    const cpfDigitado = document.getElementById('cpfAluno').value.trim();
    
    // Esconder resultados anteriores
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    
    // Validação básica
    if (!nomeDigitado || !cpfDigitado) {
        mostrarErro('Por favor, preencha todos os campos.');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // BUSCAR ALUNOS
        const alunosEncontrados = encontrarAlunos(nomeDigitado, cpfDigitado);
        
        if (alunosEncontrados.length === 0) {
            mostrarErro('Aluno não encontrado. Verifique nome e CPF.');
        } else if (alunosEncontrados.length === 1) {
            // APENAS UM ALUNO ENCONTRADO
            exibirResultados(alunosEncontrados[0]);
        } else {
            // MÚLTIPLOS ALUNOS ENCONTRADOS
            mostrarSelecaoAlunos(alunosEncontrados, nomeDigitado, cpfDigitado);
        }
    }, 800);
}

// FUNÇÃO PARA ENCONTRAR MÚLTIPLOS ALUNOS
function encontrarAlunos(nomeDigitado, cpfDigitado) {
    const nomeBusca = nomeDigitado.toUpperCase().trim();
    const cpfBusca = cpfDigitado.replace(/\D/g, '');
    
    // Se CPF foi digitado completamente, buscar exato por CPF
    if (cpfBusca.length === 11) {
        const alunoPorCPF = bancoDeAlunos.find(aluno => 
            aluno.cpf.replace(/\D/g, '') === cpfBusca
        );
        
        if (alunoPorCPF) {
            return [alunoPorCPF];
        }
    }
    
    // Se CPF parcial foi digitado, buscar por CPF parcial também
    const alunosPorCPFParcial = [];
    if (cpfBusca.length >= 3) {
        alunosPorCPFParcial.push(...bancoDeAlunos.filter(aluno => 
            aluno.cpf.replace(/\D/g, '').includes(cpfBusca)
        ));
    }
    
    // Buscar por nome
    const alunosPorNome = bancoDeAlunos.filter(aluno => {
        const alunoNome = aluno.nome.toUpperCase();
        
        // Busca exata ou parcial
        if (alunoNome.includes(nomeBusca) || nomeBusca.includes(alunoNome)) return true;
        
        // Busca por palavras
        const palavrasDigitadas = nomeBusca.split(' ').filter(p => p.length > 2);
        const palavrasAluno = alunoNome.split(' ');
        
        if (palavrasDigitadas.length === 0) return false;
        
        let coincidencias = 0;
        palavrasDigitadas.forEach(palavra => {
            if (palavrasAluno.some(palavraAluno => palavraAluno.includes(palavra))) {
                coincidencias++;
            }
        });
        
        return coincidencias >= Math.min(1, palavrasDigitadas.length);
    });
    
    // Combinar resultados únicos
    const todosAlunos = [...alunosPorCPFParcial, ...alunosPorNome];
    const alunosUnicos = [];
    const cpfVistos = new Set();
    
    todosAlunos.forEach(aluno => {
        if (!cpfVistos.has(aluno.cpf)) {
            cpfVistos.add(aluno.cpf);
            alunosUnicos.push(aluno);
        }
    });
    
    return alunosUnicos;
}

// FUNÇÃO PARA MOSTRAR SELEÇÃO DE MÚLTIPLOS ALUNOS
function mostrarSelecaoAlunos(alunosEncontrados, nomeDigitado, cpfDigitado) {
    const totalAlunos = alunosEncontrados.length;
    
    let listaHTML = `
        <div class="selecao-container">
            <div class="selecao-header">
                <h3><i class="fas fa-search"></i> Encontramos ${totalAlunos} aluno${totalAlunos > 1 ? 's' : ''}</h3>
                <p class="selecao-subtitle">
                    Para: <strong>"${nomeDigitado}"</strong>
                    ${cpfDigitado ? ` | CPF: ${cpfDigitado}` : ''}
                </p>
            </div>
            
            <div class="selecao-alerta">
                <i class="fas fa-info-circle"></i>
                <p>Encontramos mais de um aluno. Selecione o correto:</p>
            </div>
            
            <div class="lista-alunos">
    `;
    
    alunosEncontrados.forEach((aluno, index) => {
        // Determinar cor da medalha baseado nas premiações
        let corMedalha = '#64748b'; // Cinza padrão
        if (aluno.premiacoes.some(p => p.includes('Ouro'))) corMedalha = '#FFD700';
        else if (aluno.premiacoes.some(p => p.includes('Prata'))) corMedalha = '#C0C0C0';
        else if (aluno.premiacoes.some(p => p.includes('Bronze'))) corMedalha = '#CD7F32';
        
        listaHTML += `
            <div class="aluno-opcao" onclick="selecionarAluno(${index})" data-cpf="${aluno.cpf}">
                <div class="aluno-opcao-avatar">
                    <div class="avatar-inicial">${aluno.nome.charAt(0)}</div>
                    ${aluno.premiacoes.length > 0 ? 
                        `<div class="avatar-medalha" style="background: ${corMedalha};">
                            <i class="fas fa-medal"></i>
                        </div>` 
                        : ''
                    }
                </div>
                
                <div class="aluno-opcao-info">
                    <h4>${aluno.nome}</h4>
                    <div class="aluno-opcao-detalhes">
                        <span class="detalhe-item">
                            <i class="fas fa-id-card"></i>
                            ${aluno.cpf}
                        </span>
                        <span class="detalhe-item">
                            <i class="fas fa-school"></i>
                            ${aluno.escola.length > 25 ? aluno.escola.substring(0, 25) + '...' : aluno.escola}
                        </span>
                        <span class="detalhe-item">
                            <i class="fas fa-chart-bar"></i>
                            ${aluno.nivel}
                        </span>
                    </div>
                    <div class="aluno-opcao-premiacoes">
                        ${aluno.premiacoes.length > 0 ? 
                            `<span class="premio-badge">
                                <i class="fas fa-trophy"></i>
                                ${aluno.premiacoes.length} premiaç${aluno.premiacoes.length > 1 ? 'ões' : 'ão'}
                            </span>` 
                            : '<span class="sem-premio">Sem premiações</span>'
                        }
                    </div>
                </div>
                
                <div class="aluno-opcao-selecionar">
                    <i class="fas fa-chevron-right"></i>
                </div>
            </div>
        `;
    });
    
    listaHTML += `
            </div>
            
            <div class="selecao-acoes">
                <button class="btn-voltar" onclick="limparFormulario()">
                    <i class="fas fa-arrow-left"></i> Nova Busca
                </button>
                <div class="selecao-dicas">
                    <p><i class="fas fa-lightbulb"></i> <strong>Dicas para busca precisa:</strong></p>
                    <ul>
                        <li>Digite o nome COMPLETO do aluno</li>
                        <li>Ou use o CPF completo (mais rápido)</li>
                        <li>Clique no aluno correto para ver todos os detalhes</li>
                    </ul>
                </div>
            </div>
        </div>
    `;
    
    // Armazenar alunos encontrados globalmente para seleção
    window.alunosParaSelecao = alunosEncontrados;
    
    document.getElementById('resultado').innerHTML = listaHTML;
    document.getElementById('resultado').style.display = 'block';
    
    // Adicionar animação de entrada
    setTimeout(() => {
        const opcoes = document.querySelectorAll('.aluno-opcao');
        opcoes.forEach((opcao, i) => {
            setTimeout(() => {
                opcao.style.opacity = '1';
                opcao.style.transform = 'translateY(0)';
            }, i * 100);
        });
    }, 100);
}

// FUNÇÃO PARA SELECIONAR UM ALUNO DA LISTA
function selecionarAluno(indice) {
    const alunoSelecionado = window.alunosParaSelecao[indice];
    
    // Efeito visual de seleção
    const opcaoSelecionada = document.querySelectorAll('.aluno-opcao')[indice];
    opcaoSelecionada.style.background = '#4361ee15';
    opcaoSelecionada.style.borderColor = '#4361ee';
    
    // Pequeno delay para mostrar o feedback visual
    setTimeout(() => {
        exibirResultados(alunoSelecionado);
    }, 300);
}

// FUNÇÃO EXIBIR RESULTADOS (completa - mantém o código anterior)
function exibirResultados(aluno) {
    // ... (INSIRA AQUI TODO O CÓDIGO DA FUNÇÃO exibirResultados que já temos)
    // MANTENHA TODO O CÓDIGO DA VERSÃO ANTERIOR
}

// FUNÇÃO DE ERRO
function mostrarErro(mensagem) {
    document.getElementById('erro').innerHTML = `
        <div class="erro-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>${mensagem}</h3>
            <p class="erro-dica">Dica: Digite pelo menos o primeiro nome completo e CPF</p>
        </div>
    `;
    document.getElementById('erro').style.display = 'block';
}

function limparFormulario() {
    document.getElementById('nomeAluno').value = '';
    document.getElementById('cpfAluno').value = '';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    document.getElementById('nomeAluno').focus();
}

// PERMITIR ENTER PARA BUSCAR
document.getElementById('nomeAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('cpfAluno').focus();
    }
});

document.getElementById('cpfAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarNotas();
    }
});

// Focar no campo de nome ao carregar
window.onload = function() {
    document.getElementById('nomeAluno').focus();
};

// ESTILOS EXTRAS COMPLETOS
const style = document.createElement('style');
style.textContent = `
    /* ESTILOS DA SELEÇÃO DE ALUNOS */
    .selecao-container {
        background: white;
        padding: 30px;
        border-radius: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        max-width: 800px;
        margin: 0 auto;
    }
    
    .selecao-header {
        text-align: center;
        margin-bottom: 25px;
        padding-bottom: 20px;
        border-bottom: 2px solid #f1f5f9;
    }
    
    .selecao-header h3 {
        color: #1a1a2e;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
    }
    
    .selecao-subtitle {
        color: #64748b;
        font-size: 1rem;
    }
    
    .selecao-alerta {
        background: #e8f4fc;
        padding: 15px 20px;
        border-radius: 10px;
        margin-bottom: 25px;
        display: flex;
        align-items: center;
        gap: 15px;
        border-left: 4px solid #4361ee;
    }
    
    .selecao-alerta i {
        color: #4361ee;
        font-size: 1.5rem;
    }
    
    .selecao-alerta p {
        color: #1a1a2e;
        margin: 0;
        font-weight: 500;
    }
    
    .lista-alunos {
        margin: 25px 0;
    }
    
    .aluno-opcao {
        display: flex;
        align-items: center;
        gap: 20px;
        padding: 20px;
        margin: 15px 0;
        background: #f8fafc;
        border-radius: 12px;
        border: 2px solid #e2e8f0;
        cursor: pointer;
        transition: all 0.3s;
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .aluno-opcao:hover {
        background: #f1f5f9;
        border-color: #4361ee;
        transform: translateY(-2px) translateX(5px);
        box-shadow: 0 10px 20px rgba(67, 97, 238, 0.1);
    }
    
    .aluno-opcao-avatar {
        position: relative;
        flex-shrink: 0;
    }
    
    .avatar-inicial {
        width: 60px;
        height: 60px;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: bold;
    }
    
    .avatar-medalha {
        position: absolute;
        bottom: -5px;
        right: -5px;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.8rem;
        border: 2px solid white;
    }
    
    .aluno-opcao-info {
        flex: 1;
        min-width: 0; /* Para evitar overflow */
    }
    
    .aluno-opcao-info h4 {
        color: #1a1a2e;
        margin-bottom: 10px;
        font-size: 1.1rem;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .aluno-opcao-detalhes {
        display: flex;
        gap: 20px;
        flex-wrap: wrap;
        margin-bottom: 10px;
    }
    
    .detalhe-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #64748b;
        font-size: 0.85rem;
        background: white;
        padding: 5px 12px;
        border-radius: 20px;
        border: 1px solid #e2e8f0;
    }
    
    .detalhe-item i {
        color: #4361ee;
        font-size: 0.8rem;
    }
    
    .aluno-opcao-premiacoes {
        margin-top: 8px;
    }
    
    .premio-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #f59e0b15, #d9770615);
        color: #d97706;
        padding: 5px 15px;
        border-radius: 20px;
        font-size: 0.85rem;
        font-weight: 600;
        border: 1px solid #f59e0b30;
    }
    
    .sem-premio {
        color: #94a3b8;
        font-size: 0.85rem;
        font-style: italic;
    }
    
    .aluno-opcao-selecionar {
        color: #4361ee;
        font-size: 1.5rem;
        opacity: 0.7;
        transition: all 0.3s;
    }
    
    .aluno-opcao:hover .aluno-opcao-selecionar {
        opacity: 1;
        transform: translateX(5px);
    }
    
    .selecao-acoes {
        margin-top: 30px;
        padding-top: 25px;
        border-top: 2px solid #e2e8f0;
    }
    
    .btn-voltar {
        background: #e2e8f0;
        color: #475569;
        border: none;
        padding: 12px 25px;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s;
        margin-bottom: 20px;
    }
    
    .btn-voltar:hover {
        background: #cbd5e1;
        transform: translateY(-2px);
    }
    
    .selecao-dicas {
        background: #f8fafc;
        padding: 20px;
        border-radius: 10px;
        border-left: 4px solid #10b981;
    }
    
    .selecao-dicas p {
        color: #1a1a2e;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 600;
    }
    
    .selecao-dicas ul {
        margin: 0;
        padding-left: 25px;
        color: #64748b;
    }
    
    .selecao-dicas li {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .selecao-dicas i {
        color: #10b981;
    }
    
    /* Responsivo */
    @media (max-width: 768px) {
        .selecao-container {
            padding: 20px;
        }
        
        .aluno-opcao {
            flex-direction: column;
            align-items: stretch;
            gap: 15px;
            text-align: center;
        }
        
        .aluno-opcao-detalhes {
            flex-direction: column;
            gap: 10px;
            align-items: center;
        }
        
        .detalhe-item {
            justify-content: center;
        }
        
        .aluno-opcao-selecionar {
            align-self: center;
            margin-top: 10px;
        }
        
        .selecao-dicas ul {
            padding-left: 20px;
        }
    }
    
    @media (max-width: 480px) {
        .selecao-header h3 {
            flex-direction: column;
            gap: 5px;
        }
        
        .selecao-alerta {
            flex-direction: column;
            text-align: center;
            gap: 10px;
        }
    }
`;
document.head.appendChild(style);
