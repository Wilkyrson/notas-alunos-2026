// BANCO DE DADOS SIMPLES PARA TESTE
const bancoDeAlunos = [
    {
        nome: "JOÃO PEDRO PANTOJA RABELO",
        cpf: "080.023.542-81",
        matricula: "20240001",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3",
        notas: {
            fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de ouro 2026"]
       },  // ← VÍRGULA do aluno anterior
    
    {   // ← Início do NOVO aluno
        nome: "Vitor",
        cpf: "040.385.812-76",
        matricula: "20240099",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3",
        notas: {
               fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de ouro 2026"]
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
    const nome = document.getElementById('nomeAluno').value.trim().toUpperCase();
    const cpf = document.getElementById('cpfAluno').value.trim();
    
    console.log("Buscando:", nome, cpf); // Para depuração
    
    // Esconder resultados anteriores
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    
    // Validação básica
    if (!nome || !cpf) {
        mostrarErro('Preencha nome e CPF.');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    
    // Buscar aluno (SIMPLES E DIRETO)
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // Verificação DIRETA
        if (nome === "MARIA SILVA SANTOS" && cpf === "123.456.789-00") {
            exibirResultados(bancoDeAlunos[0]);
        } else {
            mostrarErro('Aluno não encontrado. Use: MARIA SILVA SANTOS e CPF: 123.456.789-00');
        }
    }, 1000);
}

// FUNÇÃO PARA EXIBIR RESULTADOS (SIMPLIFICADA)
function exibirResultados(aluno) {
    const resultadoHTML = `
        <div class="aluno-info">
            <h2>RESULTADOS</h2>
            <h3>${aluno.nome}</h3>
            <p>CPF: ${aluno.cpf}</p>
            <p>Escola: ${aluno.escola}</p>
        </div>
        
        <div class="notas-grid">
            <div class="nota-card">
                <h3>FASE 1 OBMEP</h3>
                <div class="nota-valor">${aluno.notas.fase1.nota}</div>
                <p>${aluno.notas.fase1.acertos} acertos</p>
            </div>
            <div class="nota-card">
                <h3>FASE 2 OBMEP</h3>
                <div class="nota-valor">${aluno.notas.fase2.nota}</div>
                <p>${aluno.notas.fase2.acertos} problemas</p>
            </div>
        </div>
        
        <div class="actions">
            <button class="btn-logout" onclick="limparFormulario()">
                <i class="fas fa-sign-out-alt"></i> Nova Consulta
            </button>
        </div>
    `;
    
    document.getElementById('resultado').innerHTML = resultadoHTML;
    document.getElementById('resultado').style.display = 'block';
}

// FUNÇÕES AUXILIARES
function mostrarErro(mensagem) {
    document.getElementById('erro').innerHTML = `
        <h3>❌ ${mensagem}</h3>
        <p><strong>Teste com:</strong></p>
        <p>Nome: MARIA SILVA SANTOS</p>
        <p>CPF: 123.456.789-00</p>
    `;
    document.getElementById('erro').style.display = 'block';
}

function limparFormulario() {
    document.getElementById('nomeAluno').value = '';
    document.getElementById('cpfAluno').value = '';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
}

// PERMITIR ENTER PARA BUSCAR
document.getElementById('nomeAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') document.getElementById('cpfAluno').focus();
});

document.getElementById('cpfAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') buscarNotas();
});
