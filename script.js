// DADOS DO PROFESSOR
const PROFESSOR_DADOS = {
    nome: "WILKYSON CALDAS LIMA",
    cpf: "040.385.812-76",
    senha: "@Capoeira01"
};

// BANCO DE DADOS DE ALUNOS
let bancoDeAlunos = JSON.parse(localStorage.getItem('bancoDeAlunos')) || [
    {
        nome: "JOÃO PEDRO PANTOJA RABELO",
        cpf: "080.023.542-81",
        matricula: "20240001",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, total: 30, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, total: 10, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2026"]
    },
    {
        nome: "RYAN PETTERSON NUNES BORGES",
        cpf: "131.221.334-58",
        matricula: "20240099",
        escola: "Escola Estadual Rivanda Nazare Da Silva Guimaraes",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, total: 30, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, total: 10, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2026"]
    },
    {
        nome: "VICTOR DANIEL SOUSA GOMES",
        cpf: "057.098.292-85",
        matricula: "20240003",
        escola: "Instituto Federal do Amapá",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 20.5, acertos: 21, total: 30, posicao: "Classificado" },
            fase2: { nota: 45.0, acertos: 7, total: 10, posicao: "Aguardando" },
            simulados: { nota: 88.0, media_turma: 75.0 },
            treinamentos: { nota: 92.0, participacao: "98%" }
        },
        premiacoes: ["Medalha de Prata 2025", "Menção Honrosa 2024"]
    },
    {
        nome: "VITOR KAUE SANGEL DE SOUZA",
        cpf: "022.935.912-47",
        matricula: "20240004",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 20.5, acertos: 21, total: 30, posicao: "Classificado" },
            fase2: { nota: 45.0, acertos: 7, total: 10, posicao: "Aguardando" },
            simulados: { nota: 88.0, media_turma: 75.0 },
            treinamentos: { nota: 92.0, participacao: "98%" }
        },
        premiacoes: ["Medalha de Prata 2025", "Menção Honrosa 2024"]
    }
];

// Salvar banco de dados
function salvarBancoDeDados() {
    localStorage.setItem('bancoDeAlunos', JSON.stringify(bancoDeAlunos));
}

// Inicializar banco de dados
salvarBancoDeDados();

// ========== INICIALIZAÇÃO ==========
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Sistema Acadêmico carregado!");
    
    // Configurar autocomplete
    inicializarAutocomplete();
    
    // Configurar eventos dos botões de modo
    document.getElementById('btn-aluno').addEventListener('click', function() {
        mostrarSecao('aluno');
    });
    
    document.getElementById('btn-professor').addEventListener('click', function() {
        mostrarSecao('professor');
    });
    
    // Configurar eventos de tecla Enter
    document.getElementById('nomeAluno').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('cpfAluno').focus();
        }
    });
    
    document.getElementById('cpfAluno').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            buscarNotasAluno();
        }
    });
    
    document.getElementById('professorCpf').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            document.getElementById('professorSenha').focus();
        }
    });
    
    document.getElementById('professorSenha').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginProfessor();
        }
    });
    
    // Focar no campo de nome
    document.getElementById('nomeAluno').focus();
});

// ========== GERENCIAMENTO DE SEÇÕES ==========
function mostrarSecao(modo) {
    // Atualizar botões
    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (modo === 'aluno') {
        document.getElementById('btn-aluno').classList.add('active');
        document.getElementById('aluno-section').classList.add('active');
        document.getElementById('professor-section').classList.remove('active');
        esconderAutocomplete();
    } else {
        document.getElementById('btn-professor').classList.add('active');
        document.getElementById('professor-section').classList.add('active');
        document.getElementById('aluno-section').classList.remove('active');
    }
}

// ========== AUTOCOMPLETE ==========
let timeoutBusca = null;

function inicializarAutocomplete() {
    const nomeInput = document.getElementById('nomeAluno');
    const container = nomeInput.parentElement;
    
    // Criar container do autocomplete
    const autocompleteDiv = document.createElement('div');
    autocompleteDiv.className = 'autocomplete-lista';
    autocompleteDiv.id = 'autocomplete-container';
    
    // Adicionar ao DOM
    container.style.position = 'relative';
    container.appendChild(autocompleteDiv);
    
    // Evento de input
    nomeInput.addEventListener('input', function(e) {
        const valor = e.target.value.trim();
        
        if (timeoutBusca) clearTimeout(timeoutBusca);
        
        if (!valor) {
            esconderAutocomplete();
            return;
        }
        
        timeoutBusca = setTimeout(() => {
            buscarSugestoes(valor);
        }, 300);
    });
}

function buscarSugestoes(texto) {
    const textoBusca = texto.toUpperCase().trim();
    
    if (textoBusca.length < 3) {
        esconderAutocomplete();
        return;
    }
    
    const sugestoes = bancoDeAlunos.filter(aluno => 
        aluno.nome.toUpperCase().includes(textoBusca)
    ).slice(0, 5);
    
    mostrarSugestoes(sugestoes, textoBusca);
}

function mostrarSugestoes(sugestoes, textoBusca) {
    const autocompleteDiv = document.getElementById('autocomplete-container');
    
    if (!autocompleteDiv) return;
    
    if (sugestoes.length === 0) {
        autocompleteDiv.innerHTML = `
            <div class="autocomplete-sem-resultados">
                <i class="fas fa-search"></i>
                Nenhum aluno encontrado
            </div>
        `;
        autocompleteDiv.style.display = 'block';
        return;
    }
    
    let html = '';
    sugestoes.forEach(aluno => {
        const nomeFormatado = destacarTexto(aluno.nome, textoBusca);
        const escolaAbreviada = aluno.escola.length > 35 
            ? aluno.escola.substring(0, 32) + '...' 
            : aluno.escola;
        
        html += `
            <div class="autocomplete-item" data-nome="${aluno.nome}">
                <div class="autocomplete-nome">
                    <i class="fas fa-user-graduate"></i>
                    ${nomeFormatado}
                </div>
                <div class="autocomplete-detalhes">
                    <span class="autocomplete-escola">
                        <i class="fas fa-school"></i>
                        ${escolaAbreviada}
                    </span>
                </div>
            </div>
        `;
    });
    
    autocompleteDiv.innerHTML = html;
    autocompleteDiv.style.display = 'block';
    
    // Adicionar eventos de clique
    document.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            document.getElementById('nomeAluno').value = nome;
            document.getElementById('cpfAluno').value = '';
            document.getElementById('cpfAluno').focus();
            esconderAutocomplete();
            
            mostrarNotificacao('Aluno selecionado. Digite o CPF para continuar.', 'info');
        });
    });
}

function destacarTexto(nomeCompleto, textoBusca) {
    const nome = nomeCompleto.toUpperCase();
    const texto = textoBusca.toUpperCase();
    const indice = nome.indexOf(texto);
    
    if (indice === -1) return nomeCompleto;
    
    const antes = nomeCompleto.substring(0, indice);
    const destaque = nomeCompleto.substring(indice, indice + texto.length);
    const depois = nomeCompleto.substring(indice + texto.length);
    
    return `${antes}<strong>${destaque}</strong>${depois}`;
}

function esconderAutocomplete() {
    const autocompleteDiv = document.getElementById('autocomplete-container');
    if (autocompleteDiv) {
        autocompleteDiv.style.display = 'none';
    }
}

// Fechar autocomplete ao clicar fora
document.addEventListener('click', function(e) {
    if (!e.target.closest('#autocomplete-container') && e.target.id !== 'nomeAluno') {
        esconderAutocomplete();
    }
});

// ========== FORMATAÇÃO DE CPF ==========
function formatarCPF(cpf) {
    cpf = cpf.replace(/\D/g, '');
    if (cpf.length > 11) cpf = cpf.substring(0, 11);
    
    if (cpf.length > 9) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (cpf.length > 6) {
        cpf = cpf.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (cpf.length > 3) {
        cpf = cpf.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    return cpf;
}

document.getElementById('cpfAluno').addEventListener('input', function(e) {
    this.value = formatarCPF(this.value);
    esconderAutocomplete();
});

document.getElementById('professorCpf').addEventListener('input', function(e) {
    this.value = formatarCPF(this.value);
});

// ========== LOGIN DO PROFESSOR ==========
function loginProfessor() {
    const cpfDigitado = document.getElementById('professorCpf').value.replace(/\D/g, '');
    const senhaDigitada = document.getElementById('professorSenha').value;
    
    if (!cpfDigitado || !senhaDigitada) {
        mostrarNotificacao('Por favor, preencha CPF e senha!', 'error');
        return;
    }
    
    if (cpfDigitado !== PROFESSOR_DADOS.cpf.replace(/\D/g, '')) {
        mostrarNotificacao('CPF incorreto!', 'error');
        return;
    }
    
    if (senhaDigitada !== PROFESSOR_DADOS.senha) {
        mostrarNotificacao('Senha incorreta!', 'error');
        return;
    }
    
    // Login bem-sucedido
    document.getElementById('login-professor').style.display = 'none';
    document.getElementById('dashboard-professor').style.display = 'block';
    
    mostrarNotificacao('Login realizado com sucesso!', 'success');
}

function logoutProfessor() {
    document.getElementById('login-professor').style.display = 'block';
    document.getElementById('dashboard-professor').style.display = 'none';
    document.getElementById('professorCpf').value = '';
    document.getElementById('professorSenha').value = '';
    
    mostrarNotificacao('Logout realizado com sucesso!', 'info');
}

// ========== ÁREA DO ALUNO ==========
function buscarNotasAluno() {
    const nomeDigitado = document.getElementById('nomeAluno').value.trim().toUpperCase();
    const cpfDigitado = document.getElementById('cpfAluno').value.trim();
    
    // Limpar resultados anteriores
    document.getElementById('resultado-aluno').style.display = 'none';
    document.getElementById('erro-aluno').style.display = 'none';
    esconderAutocomplete();
    
    // Validar campos
    if (!nomeDigitado || !cpfDigitado) {
        mostrarErroAluno('Por favor, preencha todos os campos.');
        return;
    }
    
    const cpfLimpo = cpfDigitado.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        mostrarErroAluno('CPF inválido. Digite os 11 números.');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading-aluno').style.display = 'block';
    
    // Simular busca (timeout para efeito visual)
    setTimeout(() => {
        document.getElementById('loading-aluno').style.display = 'none';
        
        const alunoEncontrado = bancoDeAlunos.find(aluno => 
            aluno.cpf.replace(/\D/g, '') === cpfLimpo
        );
        
        if (!alunoEncontrado) {
            mostrarErroAluno('CPF não encontrado no sistema.');
            return;
        }
        
        const nomeAluno = alunoEncontrado.nome.toUpperCase();
        if (!nomeAluno.includes(nomeDigitado) && !nomeDigitado.includes(nomeAluno)) {
            mostrarErroAluno('Nome não corresponde ao CPF informado.');
            return;
        }
        
        exibirResultadosAluno(alunoEncontrado);
        
    }, 800);
}

function mostrarErroAluno(mensagem) {
    const erroDiv = document.getElementById('erro-aluno');
    erroDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>${mensagem}</h3>
        <p class="erro-dica">Verifique se os dados estão corretos.</p>
    `;
    erroDiv.style.display = 'block';
}

// ========== FUNÇÃO PRINCIPAL: EXIBIR 4 CARDS HORIZONTAIS ==========
function exibirResultadosAluno(aluno) {
    // Calcular porcentagens e status
    const porcentagemFase1 = ((aluno.notas.fase1.nota / 30) * 100).toFixed(1);
    const porcentagemFase2 = ((aluno.notas.fase2.nota / 50) * 100).toFixed(1);
    
    // Determinar status da 1ª fase
    let statusFase1 = '';
    let statusFase1Class = '';
    if (porcentagemFase1 >= 70) {
        statusFase1 = 'Classificado';
        statusFase1Class = 'status-aprovado';
    } else if (porcentagemFase1 >= 50) {
        statusFase1 = 'Em Análise';
        statusFase1Class = 'status-atencao';
    } else {
        statusFase1 = 'Não Classificado';
        statusFase1Class = 'status-atencao';
    }
    
    // Determinar status da 2ª fase
    let statusFase2 = '';
    let statusFase2Class = '';
    if (porcentagemFase2 >= 70) {
        statusFase2 = 'Aprovado';
        statusFase2Class = 'status-aprovado';
    } else if (porcentagemFase2 >= 50) {
        statusFase2 = 'Recuperação';
        statusFase2Class = 'status-atencao';
    } else {
        statusFase2 = 'Reprovado';
        statusFase2Class = 'status-atencao';
    }
    
    // Determinar reconhecimento com base na média geral
    const notasValores = [
        aluno.notas.fase1.nota,
        aluno.notas.fase2.nota,
        aluno.notas.simulados.nota,
        aluno.notas.treinamentos.nota
    ];
    const mediaGeral = (notasValores.reduce((a, b) => a + b, 0) / notasValores.length).toFixed(1);
    
    let reconhecimento = '';
    let medalha = '';
    let descricao = '';
    
    if (mediaGeral >= 90) {
        reconhecimento = 'MEDALHA DE OURO';
        medalha = '🥇';
        descricao = 'Excelência acadêmica demonstrada em todas as avaliações.';
    } else if (mediaGeral >= 80) {
        reconhecimento = 'MEDALHA DE PRATA';
        medalha = '🥈';
        descricao = 'Desempenho acima da média com dedicação notável.';
    } else if (mediaGeral >= 70) {
        reconhecimento = 'MEDALHA DE BRONZE';
        medalha = '🥉';
        descricao = 'Bom desempenho com evolução consistente.';
    } else if (mediaGeral >= 60) {
        reconhecimento = 'MENÇÃO HONROSA';
        medalha = '🏅';
        descricao = 'Participação e esforço reconhecidos.';
    } else {
        reconhecimento = 'PARTICIPAÇÃO';
        medalha = '✅';
        descricao = 'Participação no processo avaliativo.';
    }
    
    // HTML dos 4 cards horizontais
    const resultadoHTML = `
        <div class="aluno-info-header">
            <h2>${aluno.nome}</h2>
            <span class="aluno-nivel">${aluno.nivel}</span>
        </div>
        
        <div class="cards-container">
            <!-- CARD 1: DADOS PESSOAIS -->
            <div class="card card-dados">
                <h3><i class="fas fa-user-circle"></i> Dados Pessoais</h3>
                <div class="detalhe-item">
                    <div class="detalhe-label">
                        <i class="fas fa-user"></i> Nome Completo
                    </div>
                    <div class="detalhe-valor">${aluno.nome}</div>
                </div>
                <div class="detalhe-item">
                    <div class="detalhe-label">
                        <i class="fas fa-id-card"></i> CPF
                    </div>
                    <div class="detalhe-valor">${aluno.cpf}</div>
                </div>
                <div class="detalhe-item">
                    <div class="detalhe-label">
                        <i class="fas fa-hashtag"></i> Matrícula
                    </div>
                    <div class="detalhe-valor">${aluno.matricula}</div>
                </div>
                <div class="detalhe-item">
                    <div class="detalhe-label">
                        <i class="fas fa-school"></i> Escola
                    </div>
                    <div class="detalhe-valor">${aluno.escola}</div>
                </div>
            </div>
            
            <!-- CARD 2: 1ª FASE -->
            <div class="card card-fase1">
                <h3><i class="fas fa-flag"></i> 1ª Fase</h3>
                <div class="nota-grande">${aluno.notas.fase1.nota}</div>
                <div class="metricas-grid">
                    <div class="metrica">
                        <div class="metrica-valor">${aluno.notas.fase1.acertos}/${aluno.notas.fase1.total}</div>
                        <div class="metrica-label">Acertos</div>
                    </div>
                    <div class="metrica">
                        <div class="metrica-valor">${porcentagemFase1}%</div>
                        <div class="metrica-label">Pontuação</div>
                    </div>
                </div>
                <div class="${statusFase1Class} status-badge">${statusFase1}</div>
            </div>
            
            <!-- CARD 3: 2ª FASE -->
            <div class="card card-fase2">
                <h3><i class="fas fa-flag-checkered"></i> 2ª Fase</h3>
                <div class="nota-grande">${aluno.notas.fase2.nota}</div>
                <div class="metricas-grid">
                    <div class="metrica">
                        <div class="metrica-valor">${aluno.notas.fase2.acertos}/${aluno.notas.fase2.total}</div>
                        <div class="metrica-label">Problemas</div>
                    </div>
                    <div class="metrica">
                        <div class="metrica-valor">${porcentagemFase2}%</div>
                        <div class="metrica-label">Pontuação</div>
                    </div>
                </div>
                <div class="${statusFase2Class} status-badge">${statusFase2}</div>
            </div>
            
            <!-- CARD 4: RECONHECIMENTO -->
            <div class="card card-reconhecimento">
                <h3><i class="fas fa-trophy"></i> Reconhecimento</h3>
                <div class="medalha-container">
                    <span class="medalha-grande">${medalha}</span>
                    <div class="categoria-premiacao">${reconhecimento}</div>
                    <div class="descricao-premiacao">${descricao}</div>
                </div>
                <div class="detalhe-item" style="margin-top: 20px;">
                    <div class="detalhe-label">
                        <i class="fas fa-chart-line"></i> Média Geral
                    </div>
                    <div class="detalhe-valor" style="color: #4361ee; font-size: 1.3rem;">${mediaGeral}%</div>
                </div>
            </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px;">
            <button class="btn btn-secondary" onclick="limparFormularioAluno()">
                <i class="fas fa-redo"></i> Nova Consulta
            </button>
            <button class="btn btn-primary" onclick="window.print()" style="margin-left: 10px;">
                <i class="fas fa-print"></i> Imprimir Relatório
            </button>
        </div>
    `;
    
    const resultadoDiv = document.getElementById('resultado-aluno');
    resultadoDiv.innerHTML = resultadoHTML;
    resultadoDiv.style.display = 'block';
    
    // Rolar suavemente até os resultados
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
    
    mostrarNotificacao('Dados do aluno carregados com sucesso!', 'success');
}

function limparFormularioAluno() {
    document.getElementById('nomeAluno').value = '';
    document.getElementById('cpfAluno').value = '';
    document.getElementById('resultado-aluno').style.display = 'none';
    document.getElementById('erro-aluno').style.display = 'none';
    document.getElementById('nomeAluno').focus();
}

// ========== SISTEMA DE NOTIFICAÇÕES ==========
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Remover notificação anterior
    const notificacaoAnterior = document.querySelector('.notification');
    if (notificacaoAnterior) {
        notificacaoAnterior.remove();
    }
    
    // Criar nova notificação
    const notificacao = document.createElement('div');
    notificacao.className = `notification ${tipo}`;
    
    let icone = '';
    switch(tipo) {
        case 'success':
            icone = 'fa-check-circle';
            break;
        case 'error':
            icone = 'fa-exclamation-circle';
            break;
        default:
            icone = 'fa-info-circle';
    }
    
    notificacao.innerHTML = `
        <i class="fas ${icone}"></i>
        <span>${mensagem}</span>
    `;
    
    document.body.appendChild(notificacao);
    
    // Remover após 5 segundos
    setTimeout(() => {
        if (notificacao.parentNode) {
            notificacao.remove();
        }
    }, 5000);
}

// ========== FUNÇÕES AUXILIARES ==========
// Estas funções podem ser expandidas conforme necessário
function carregarAlunos() {
    // Implementar se necessário para o dashboard do professor
    console.log("Função carregarAlunos disponível para expansão");
}

function atualizarEstatisticas() {
    // Implementar se necessário para o dashboard do professor
    console.log("Função atualizarEstatisticas disponível para expansão");
}

// Exportar função para o HTML
window.buscarNotasAluno = buscarNotasAluno;
window.loginProfessor = loginProfessor;
window.logoutProfessor = logoutProfessor;
window.limparFormularioAluno = limparFormularioAluno;
