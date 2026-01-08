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
    if (cpf.length > 11) cpf = cpf.substring(
