// BANCO DE DADOS DE ALUNOS
const bancoDeAlunos = [
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
    {
        nome: "VITOR",
        cpf: "040.385.812-76",
        matricula: "20240099",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Ouro 2026"]
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
    
    // Buscar aluno
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // Busca no banco de dados
        const aluno = bancoDeAlunos.find(a => 
            a.nome === nome && a.cpf === cpf
        );
        
        if (aluno) {
            exibirResultados(aluno);
        } else {
            mostrarErro('Aluno não encontrado.');
        }
    }, 1000);
}

// FUNÇÃO PARA EXIBIR RESULTADOS
function exibirResultados(aluno) {
    const resultadoHTML = `
        <div class="aluno-info">
            <h2>RESULTADOS OBMEP</h2>
            <h3>${aluno.nome}</h3>
            <div class="aluno-details">
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span>CPF: ${aluno.cpf}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hashtag"></i>
                    <span>Matrícula: ${aluno.matricula}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-school"></i>
                    <span>${aluno.escola}</span>
                </div>
            </div>
        </div>
        
        <div class="notas-grid">
            <div class="nota-card">
                <h3>FASE 1 OBMEP</h3>
                <div class="nota-valor">${aluno.notas.fase1.nota}</div>
                <p>${aluno.notas.fase1.acertos} acertos</p>
                <p>Status: ${aluno.notas.fase1.posicao}</p>
            </div>
            <div class="nota-card">
                <h3>FASE 2 OBMEP</h3>
                <div class="nota-valor">${aluno.notas.fase2.nota}</div>
                <p>${aluno.notas.fase2.acertos} problemas</p>
                <p>Status: ${aluno.notas.fase2.posicao}</p>
            </div>
            <div class="nota-card">
                <h3>SIMULADOS</h3>
                <div class="nota-valor">${aluno.notas.simulados.nota}%</div>
                <p>Média da turma: ${aluno.notas.simulados.media_turma}%</p>
            </div>
            <div class="nota-card">
                <h3>TREINAMENTOS</h3>
                <div class="nota-valor">${aluno.notas.treinamentos.nota}%</div>
                <p>Participação: ${aluno.notas.treinamentos.participacao}</p>
            </div>
        </div>
        
        <div class="status-container">
            <div class="media-final">
                <h3>PREMIAÇÕES</h3>
                ${aluno.premiacoes.map(premio => 
                    `<div class="premiacao-item">
                        <i class="fas fa-medal"></i>
                        <span>${premio}</span>
                    </div>`
                ).join('')}
            </div>
        </div>
        
        <div class="actions">
            <button class="btn-print" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimir
            </button>
            <button class="btn-logout" onclick="limparFormulario()">
                <i class="fas fa-sign-out-alt"></i> Nova Consulta
            </button>
        </div>
    `;
    
    document.getElementById('resultado').innerHTML = resultadoHTML;
    document.getElementById('resultado').style.display = 'block';
}

// FUNÇÃO DE ERRO SIMPLIFICADA
function mostrarErro(mensagem) {
    document.getElementById('erro').innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>❌ Aluno não encontrado</h3>
        <p>Verifique se o nome e CPF estão corretos.</p>
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

// ESTILOS EXTRAS
const style = document.createElement('style');
style.textContent = `
    .aluno-details {
        display: flex;
        justify-content: center;
        gap: 20px;
        margin-top: 15px;
        flex-wrap: wrap;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #475569;
    }
    
    .notas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .nota-card {
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        border: 1px solid #e2e8f0;
    }
    
    .nota-card h3 {
        color: #475569;
        margin-bottom: 15px;
    }
    
    .nota-valor {
        font-size: 2.5rem;
        font-weight: bold;
        color: #4361ee;
        margin: 10px 0;
    }
    
    .status-container {
        background: #f8fafc;
        padding: 25px;
        border-radius: 12px;
        margin: 20px 0;
    }
    
    .premiacao-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 10px 0;
        padding: 10px;
        background: white;
        border-radius: 8px;
    }
    
    .actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 25px;
    }
    
    .btn-print, .btn-logout {
        padding: 12px 25px;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .btn-print {
        background: #e2e8f0;
        color: #475569;
    }
    
    .btn-logout {
        background: #fee2e2;
        color: #dc2626;
    }
`;
document.head.appendChild(style);
