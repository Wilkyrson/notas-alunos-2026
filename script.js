// Banco de dados simulado com CPF para OBMEP
const bancoDeAlunos = [
    {
        nome: "MARIA SILVA SANTOS",
        cpf: "123.456.789-00",
        matricula: "20240001",
        escola: "EE Professora Maria José",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 18.5, acertos: 20, posicao: "Classificado" },
            fase2: { nota: 42.0, acertos: 6, posicao: "Aguardando" },
            simulados: { nota: 85.0, media_turma: 72.5 },
            treinamentos: { nota: 90.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Bronze 2023", "Menção Honrosa 2022"]
    },
    {
        nome: "JOAO PEDRO OLIVEIRA",
        cpf: "987.654.321-00",
        matricula: "20240002",
        escola: "Colégio Estadual São Paulo",
        nivel: "Nível 2 (8º-9º ano)",
        notas: {
            fase1: { nota: 22.0, acertos: 22, posicao: "Classificado" },
            fase2: { nota: 38.5, acertos: 5, posicao: "Aguardando" },
            simulados: { nota: 78.0, media_turma: 72.5 },
            treinamentos: { nota: 82.0, participacao: "95%" }
        },
        premiacoes: ["Menção Honrosa 2023"]
    },
    {
        nome: "ANA CLARA COSTA",
        cpf: "456.789.123-00",
        matricula: "20240003",
        escola: "Instituto Federal de Educação",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 24.5, acertos: 24, posicao: "Classificado" },
            fase2: { nota: 45.5, acertos: 7, posicao: "Aguardando" },
            simulados: { nota: 92.0, media_turma: 72.5 },
            treinamentos: { nota: 96.0, participacao: "100%" }
        },
        premiacoes: ["Medalha de Prata 2023", "Medalha de Bronze 2022"]
    }
];

// Máscara para CPF
document.getElementById('cpfAluno').addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
        value = value.substring(0, 11);
    }
    
    // Formatar CPF: 000.000.000-00
    if (value.length > 9) {
        value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    } else if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{1,3})/, "$1.$2.$3");
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{1,3})/, "$1.$2");
    }
    
    e.target.value = value;
});

// Validação de CPF (simplificada)
function validarCPF(cpf) {
    // Remove caracteres não numéricos
    cpf = cpf.replace(/[^\d]/g, '');
    
    // Verifica se tem 11 dígitos
    if (cpf.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cpf)) return false;
    
    // Algoritmo de validação de CPF
    let soma = 0;
    let resto;
    
    for (let i = 1; i <= 9; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (11 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(9, 10))) return false;
    
    soma = 0;
    for (let i = 1; i <= 10; i++) {
        soma += parseInt(cpf.substring(i-1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.substring(10, 11))) return false;
    
    return true;
}

function buscarNotas() {
    const nome = document.getElementById('nomeAluno').value.trim().toUpperCase();
    const cpf = document.getElementById('cpfAluno').value.trim();
    
    // Esconder resultados anteriores
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    
    // Validações
    if (!nome) {
        mostrarErro('Por favor, informe seu nome completo.');
        return;
    }
    
    if (!cpf) {
        mostrarErro('Por favor, informe seu CPF.');
        return;
    }
    
    // Validar formato do CPF
    if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(cpf)) {
        mostrarErro('CPF inválido. Use o formato: 000.000.000-00');
        return;
    }
    
    // Validar CPF (opcional - pode remover se não quiser validar o dígito)
    if (!validarCPF(cpf)) {
        mostrarErro('CPF inválido. Verifique os dígitos informados.');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    
    // Simular busca
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // Buscar aluno (verifica nome E CPF)
        const aluno = bancoDeAlunos.find(a => 
            a.nome === nome && a.cpf === cpf
        );
        
        if (aluno) {
            exibirResultadosOBMEP(aluno);
        } else {
            // Tentar encontrar com nome similar
            const alunoSimilar = bancoDeAlunos.find(a => 
                a.nome.includes(nome) && a.cpf === cpf
            );
            
            if (alunoSimilar) {
                exibirResultadosOBMEP(alunoSimilar);
            } else {
                mostrarErro('Aluno não encontrado na OBMEP 2024. Verifique se o nome e CPF estão corretos.');
            }
        }
    }, 1500);
}

function exibirResultadosOBMEP(aluno) {
    // Calcular desempenho geral
    const notas = [
        aluno.notas.fase1.nota,
        aluno.notas.fase2.nota,
        aluno.notas.simulados.nota,
        aluno.notas.treinamentos.nota
    ];
    const media = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
    
    // Determinar status
    let status, statusClass;
    if (media >= 80) {
        status = "DESTAQUE NACIONAL";
        statusClass = "aprovado";
    } else if (media >= 60) {
        status = "BOA PERFORMANCE";
        statusClass = "recuperacao";
    } else {
        status = "EM DESENVOLVIMENTO";
        statusClass = "reprovado";
    }
    
    // Gerar HTML das notas OBMEP
    let notasHTML = '';
    
    // Fase 1
    notasHTML += `
        <div class="nota-card" style="border-left: 5px solid #4361ee;">
            <h3><i class="fas fa-flag"></i> 1ª FASE OBMEP</h3>
            <div class="nota-valor" style="color: #4361ee;">${aluno.notas.fase1.nota}</div>
            <div class="nota-detalhes">
                <p><i class="fas fa-check-circle"></i> ${aluno.notas.fase1.acertos} acertos</p>
                <p><i class="fas fa-trophy"></i> ${aluno.notas.fase1.posicao}</p>
            </div>
        </div>
    `;
    
    // Fase 2
    notasHTML += `
        <div class="nota-card" style="border-left: 5px solid #3a0ca3;">
            <h3><i class="fas fa-flag-checkered"></i> 2ª FASE OBMEP</h3>
            <div class="nota-valor" style="color: #3a0ca3;">${aluno.notas.fase2.nota}</div>
            <div class="nota-detalhes">
                <p><i class="fas fa-check-circle"></i> ${aluno.notas.fase2.acertos} problemas resolvidos</p>
                <p><i class="fas fa-hourglass-half"></i> ${aluno.notas.fase2.posicao}</p>
            </div>
        </div>
    `;
    
    // Simulados
    notasHTML += `
        <div class="nota-card" style="border-left: 5px solid #10b981;">
            <h3><i class="fas fa-clipboard-check"></i> SIMULADOS</h3>
            <div class="nota-valor" style="color: #10b981;">${aluno.notas.simulados.nota}%</div>
            <div class="nota-detalhes">
                <p><i class="fas fa-chart-line"></i> Média da turma: ${aluno.notas.simulados.media_turma}%</p>
                <p><i class="fas fa-ranking-star"></i> ${aluno.notas.simulados.nota > aluno.notas.simulados.media_turma ? 'Acima da média' : 'Na média'}</p>
            </div>
        </div>
    `;
    
    // Treinamentos
    notasHTML += `
        <div class="nota-card" style="border-left: 5px solid #f59e0b;">
            <h3><i class="fas fa-dumbbell"></i> TREINAMENTOS</h3>
            <div class="nota-valor" style="color: #f59e0b;">${aluno.notas.treinamentos.nota}%</div>
            <div class="nota-detalhes">
                <p><i class="fas fa-calendar-check"></i> Participação: ${aluno.notas.treinamentos.participacao}</p>
                <p><i class="fas fa-fire"></i> ${aluno.notas.treinamentos.nota >= 90 ? 'Alta dedicação' : 'Boa dedicação'}</p>
            </div>
        </div>
    `;
    
    // Gerar HTML das premiações
    let premiacoesHTML = '';
    if (aluno.premiacoes.length > 0) {
        aluno.premiacoes.forEach(premio => {
            let corIcone = '#f59e0b'; // Bronze padrão
            if (premio.includes('Prata')) corIcone = '#c0c0c0';
            if (premio.includes('Ouro')) corIcone = '#ffd700';
            
            premiacoesHTML += `
                <div class="premiacao-item">
                    <i class="fas fa-medal" style="color: ${corIcone};"></i>
                    <span>${premio}</span>
                </div>
            `;
        });
    } else {
        premiacoesHTML = '<p style="color: #64748b;">Nenhuma premiação anterior</p>';
    }
    
    // Montar resultado completo OBMEP
    const resultadoHTML = `
        <div class="aluno-info">
            <div class="obmep-header">
                <div class="obmep-logo">
                    <i class="fas fa-calculator"></i>
                    <h2>RESULTADOS OBMEP 2024</h2>
                </div>
                <div class="obmep-badge">
                    <i class="fas fa-award"></i>
                    <span>${aluno.nivel}</span>
                </div>
            </div>
            
            <h3 style="margin-top: 15px; color: #1a1a2e;">${aluno.nome}</h3>
            
            <div class="aluno-details">
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span>CPF: ${aluno.cpf}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hashtag"></i>
                    <span>Inscrição: ${aluno.matricula}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-school"></i>
                    <span>${aluno.escola}</span>
                </div>
            </div>
        </div>
        
        <div class="notas-grid">
            ${notasHTML}
        </div>
        
        <div class="status-container">
            <div class="media-final">
                <h3>DESEMPENHO GERAL</h3>
                <div class="media-final-valor">${media}%</div>
                <div class="status ${statusClass}">${status}</div>
                <p style="margin-top: 10px; color: #64748b; font-size: 0.9rem;">
                    <i class="fas fa-chart-bar"></i> Baseado em todas as avaliações
                </p>
            </div>
            
            <div class="frequencia">
                <h3>PREMIAÇÕES ANTERIORES</h3>
                <div class="premiacoes-list">
                    ${premiacoesHTML}
                </div>
            </div>
        </div>
        
        <div class="obmep-observacoes">
            <h3><i class="fas fa-info-circle"></i> OBSERVAÇÕES</h3>
            <ul>
                <li>Resultados da 2ª fase serão divulgados em Dezembro/2024</li>
                <li>Cerimônia de premiação: Março/2025</li>
                <li>Treinamentos para 2025 iniciam em Janeiro</li>
                <li>Dúvidas: obmep@impa.br ou (21) 2529-5080</li>
            </ul>
        </div>
        
        <div class="actions">
            <button class="btn-print" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimir Resultado
            </button>
            <button class="btn-logout" onclick="limparFormulario()">
                <i class="fas fa-sign-out-alt"></i> Nova Consulta
            </button>
            <a href="https://www.obmep.org.br/" target="_blank" class="btn-obmep">
                <i class="fas fa-external-link-alt"></i> Site Oficial OBMEP
            </a>
        </div>
    `;
    
    // Exibir resultado
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = resultadoHTML;
    resultadoDiv.style.display = 'block';
    
    // Rolar até o resultado
    resultadoDiv.scrollIntoView({ behavior: 'smooth' });
}

function mostrarErro(mensagem) {
    const erroDiv = document.getElementById('erro');
    erroDiv.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        <h3>ALUNO NÃO ENCONTRADO</h3>
        <p>${mensagem}</p>
        <div style="margin-top: 20px; background: #f8fafc; padding: 15px; border-radius: 8px;">
            <h4 style="color: #475569; margin-bottom: 10px;"><i class="fas fa-lightbulb"></i> Dicas:</h4>
            <ul style="text-align: left; color: #64748b;">
                <li>Use o nome completo como na inscrição da OBMEP</li>
                <li>CPF deve ter o formato: 000.000.000-00</li>
                <li>Verifique se sua escola inscreveu você</li>
                <li>Contate seu professor responsável pela OBMEP</li>
            </ul>
        </div>
    `;
    erroDiv.style.display = 'block';
}

function limparFormulario() {
    document.getElementById('nomeAluno').value = '';
    document.getElementById('cpfAluno').value = '';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    document.getElementById('nomeAluno').focus();
}

// Permitir busca com Enter
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

// Adicionar estilos extras para OBMEP
const style = document.createElement('style');
style.textContent = `
    .obmep-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .obmep-logo {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .obmep-logo i {
        font-size: 2.5rem;
        color: #4361ee;
    }
    
    .obmep-badge {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .nota-detalhes {
        margin-top: 10px;
        font-size: 0.85rem;
        color: #64748b;
    }
    
    .nota-detalhes p {
        margin: 5px 0;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .premiacoes-list {
        margin-top: 10px;
    }
    
    .premiacao-item {
        display: flex;
        align-items: center;
        gap: 10px;
        margin: 8px 0;
        padding: 8px;
        background: #f8fafc;
        border-radius: 8px;
    }
    
    .obmep-observacoes {
        background: #f0f9ff;
        padding: 20px;
        border-radius: 12px;
        margin-top: 25px;
        border-left: 4px solid #4361ee;
    }
    
    .obmep-observacoes h3 {
        color: #1a1a2e;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .obmep-observacoes ul {
        margin-left: 20px;
        color: #475569;
    }
    
    .obmep-observacoes li {
        margin-bottom: 8px;
        line-height: 1.5;
    }
    
    .btn-obmep {
        background: #10b981;
        color: white;
        padding: 12px 25px;
        border-radius: 8px;
        text-decoration: none;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        transition: all 0.3s;
    }
    
    .btn-obmep:hover {
        background: #059669;
        transform: translateY(-2px);
    }
`;
document.head.appendChild(style);
