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
    {
        nome: "VICTOR DANIEL SOUSA GOMES",
        cpf: "057.098.292-85",
        matricula: "20240003",
        escola: "Instituto Federal do Amapá",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 20.5, acertos: 21, posicao: "Classificado" },
            fase2: { nota: 45.0, acertos: 7, posicao: "Aguardando" },
            simulados: { nota: 88.0, media_turma: 75.0 },
            treinamentos: { nota: 92.0, participacao: "98%" }
        },
        premiacoes: ["Medalha de Prata 2025", "Menção Honrosa 2024"]
    },
    {
        nome: "VITOR KAUE SANGEL DE SOUZA",
        cpf: "022.953.912-47",
        matricula: "20240004",
        escola: "Escola Conexão Aquarela",
        nivel: "Nível 3 (Ensino Médio)",
        notas: {
            fase1: { nota: 20.5, acertos: 21, posicao: "Classificado" },
            fase2: { nota: 45.0, acertos: 7, posicao: "Aguardando" },
            simulados: { nota: 88.0, media_turma: 75.0 },
            treinamentos: { nota: 92.0, participacao: "98%" }
        },
        premiacoes: ["Medalha de Prata 2025", "Menção Honrosa 2024"]
    }
];

// ========== AUTOCOMPLETE DE NOMES ==========
let timeoutBusca = null;
const listaAutocomplete = document.createElement('div');
listaAutocomplete.className = 'autocomplete-lista';

// ENCONTRAR O CONTAINER CORRETAMENTE
function encontrarContainerAutocomplete() {
    // Verifica se o elemento .form-group existe
    const formGroup = document.querySelector('.form-group');
    if (formGroup) {
        // Verifica se é o primeiro form-group (onde está o campo nome)
        const nomeInput = document.getElementById('nomeAluno');
        if (nomeInput && nomeInput.parentElement === formGroup) {
            return formGroup;
        }
    }
    
    // Se não encontrou, tenta o container pai do campo nome
    const nomeInput = document.getElementById('nomeAluno');
    if (nomeInput && nomeInput.parentElement) {
        return nomeInput.parentElement;
    }
    
    // Último recurso: usa o body
    return document.body;
}

// INICIALIZAR AUTOCOMPLETE
const containerAutocomplete = encontrarContainerAutocomplete();
if (containerAutocomplete) {
    containerAutocomplete.style.position = 'relative';
    containerAutocomplete.appendChild(listaAutocomplete);
    console.log("✅ Autocomplete adicionado ao container:", containerAutocomplete.className);
} else {
    console.error("❌ Não foi possível encontrar o container para o autocomplete");
}

// EVENTO DE INPUT NO CAMPO NOME
document.getElementById('nomeAluno').addEventListener('input', function(e) {
    const valor = e.target.value.trim();
    
    // Limpar timeout anterior
    if (timeoutBusca) clearTimeout(timeoutBusca);
    
    // Limpar lista se campo vazio
    if (!valor) {
        listaAutocomplete.innerHTML = '';
        listaAutocomplete.style.display = 'none';
        return;
    }
    
    // Aguardar um pouco antes de buscar (debounce)
    timeoutBusca = setTimeout(() => {
        buscarSugestoes(valor);
    }, 300);
});

// FECHAR AUTOCOMPLETE AO CLICAR FORA
document.addEventListener('click', function(e) {
    if (!e.target.closest('.autocomplete-lista') && e.target.id !== 'nomeAluno') {
        listaAutocomplete.style.display = 'none';
    }
});

// BUSCAR SUGESTÕES DE NOMES (FUNCIONANDO)
function buscarSugestoes(texto) {
    const textoBusca = texto.toUpperCase().trim();
    
    console.log(`🔍 Buscando sugestões para: "${texto}" (${textoBusca})`);
    
    // Apenas buscar se tiver pelo menos 3 caracteres
    if (textoBusca.length < 3) {
        listaAutocomplete.innerHTML = '';
        listaAutocomplete.style.display = 'none';
        console.log("❌ Busca cancelada: menos de 3 caracteres");
        return;
    }
    
    // Filtrar alunos cujo nome contenha o texto
    const sugestoes = bancoDeAlunos.filter(aluno => {
        const nomeAluno = aluno.nome.toUpperCase();
        const resultado = nomeAluno.includes(textoBusca);
        console.log(`  - ${aluno.nome}: ${resultado ? '✅' : '❌'}`);
        return resultado;
    }).slice(0, 5); // Limitar a 5 sugestões
    
    console.log(`✅ Encontrados ${sugestoes.length} alunos`);
    
    if (sugestoes.length === 0) {
        listaAutocomplete.innerHTML = `
            <div class="autocomplete-sem-resultados">
                <i class="fas fa-search"></i>
                Nenhum aluno encontrado
            </div>
        `;
        listaAutocomplete.style.display = 'block';
        return;
    }
    
    // Gerar HTML das sugestões
    let html = '';
    sugestoes.forEach(aluno => {
        // Destacar parte do nome que coincide
        const nomeFormatado = destacarTexto(aluno.nome, textoBusca);
        
        // Abreviar escola se for muito longa
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
    
    listaAutocomplete.innerHTML = html;
    listaAutocomplete.style.display = 'block';
    
    // Adicionar eventos aos itens (APENAS PREENCHE O NOME)
    document.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', function() {
            const nome = this.getAttribute('data-nome');
            console.log(`✅ Clicou no aluno: ${nome}`);
            
            // PREENCHE APENAS O NOME (NÃO PREENCHE CPF)
            document.getElementById('nomeAluno').value = nome;
            
            // Limpa o campo CPF (caso tenha algo)
            document.getElementById('cpfAluno').value = '';
            
            // Foca no campo CPF
            document.getElementById('cpfAluno').focus();
            
            // Esconder lista
            listaAutocomplete.style.display = 'none';
            
            // Mensagem de confirmação
            mostrarFeedback('Aluno selecionado. Digite o CPF para continuar.');
        });
    });
}

// FUNÇÃO PARA DESTACAR TEXTO CORRESPONDENTE
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

// FUNÇÃO DE FEEDBACK SUTIL
function mostrarFeedback(mensagem) {
    // Remover feedback anterior se existir
    const feedbackAnterior = document.querySelector('.feedback-autocomplete');
    if (feedbackAnterior) feedbackAnterior.remove();
    
    const feedback = document.createElement('div');
    feedback.className = 'feedback-autocomplete';
    feedback.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>${mensagem}</span>
    `;
    
    // Adicionar ao body
    document.body.appendChild(feedback);
    
    // Remover após 3 segundos
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 3000);
}

// ========== FORMATAÇÃO DE CPF ==========
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
    
    // Esconder autocomplete ao começar a digitar CPF
    listaAutocomplete.style.display = 'none';
});

// ========== FUNÇÃO PRINCIPAL DE BUSCA ==========
function buscarNotas() {
    const nomeDigitado = document.getElementById('nomeAluno').value.trim().toUpperCase();
    const cpfDigitado = document.getElementById('cpfAluno').value.trim();
    
    // Esconder resultados anteriores e autocomplete
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    listaAutocomplete.style.display = 'none';
    
    // VALIDAÇÃO FORTE
    if (!nomeDigitado || !cpfDigitado) {
        mostrarErro('Por favor, preencha todos os campos.');
        return;
    }
    
    // Validar formato do CPF
    const cpfLimpo = cpfDigitado.replace(/\D/g, '');
    if (cpfLimpo.length !== 11) {
        mostrarErro('CPF inválido. Digite os 11 números.');
        return;
    }
    
    // Mostrar loading
    document.getElementById('loading').style.display = 'block';
    
    // Buscar aluno (SEGURO - CPF EXATO + NOME)
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // Buscar aluno por CPF EXATO
        const alunoEncontrado = bancoDeAlunos.find(aluno => 
            aluno.cpf.replace(/\D/g, '') === cpfLimpo
        );
        
        if (!alunoEncontrado) {
            mostrarErro('CPF não encontrado no sistema.');
            return;
        }
        
        // Verificar se o nome corresponde
        const nomeAluno = alunoEncontrado.nome.toUpperCase();
        if (!nomeAluno.includes(nomeDigitado) && !nomeDigitado.includes(nomeAluno)) {
            mostrarErro('Nome não corresponde ao CPF informado.');
            return;
        }
        
        // Se passou todas as validações, mostrar resultados
        exibirResultados(alunoEncontrado);
        
    }, 1000);
}

// ========== FUNÇÃO PARA EXIBIR RESULTADOS ==========
function exibirResultados(aluno) {
    // Calcular média geral
    const notasValores = [
        aluno.notas.fase1.nota,
        aluno.notas.fase2.nota,
        aluno.notas.simulados.nota,
        aluno.notas.treinamentos.nota
    ];
    const mediaGeral = (notasValores.reduce((a, b) => a + b, 0) / notasValores.length).toFixed(1);
    
    // Determinar status
    let status = "";
    let statusClass = "";
    
    if (mediaGeral >= 80) {
        status = "EXCELENTE";
        statusClass = "aprovado";
    } else if (mediaGeral >= 60) {
        status = "BOM";
        statusClass = "recuperacao";
    } else {
        status = "EM DESENVOLVIMENTO";
        statusClass = "reprovado";
    }
    
    const resultadoHTML = `
        <div class="aluno-info">
            <div class="aluno-header">
                <h2><i class="fas fa-user-graduate"></i> ${aluno.nome}</h2>
                <span class="aluno-nivel">${aluno.nivel}</span>
            </div>
            
            <div class="aluno-details">
                <div class="detail-item">
                    <i class="fas fa-id-card"></i>
                    <span><strong>CPF:</strong> ${aluno.cpf}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-hashtag"></i>
                    <span><strong>Matrícula:</strong> ${aluno.matricula}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-school"></i>
                    <span><strong>Escola:</strong> ${aluno.escola}</span>
                </div>
            </div>
        </div>
        
        <div class="notas-grid">
            <div class="nota-card">
                <h3><i class="fas fa-flag"></i> FASE 1</h3>
                <div class="nota-valor">${aluno.notas.fase1.nota}</div>
                <div class="nota-detalhes">
                    <p><i class="fas fa-check-circle"></i> ${aluno.notas.fase1.acertos} acertos</p>
                    <p><i class="fas fa-chart-line"></i> ${aluno.notas.fase1.posicao}</p>
                </div>
            </div>
            
            <div class="nota-card">
                <h3><i class="fas fa-flag-checkered"></i> FASE 2</h3>
                <div class="nota-valor">${aluno.notas.fase2.nota}</div>
                <div class="nota-detalhes">
                    <p><i class="fas fa-check-circle"></i> ${aluno.notas.fase2.acertos} problemas</p>
                    <p><i class="fas fa-hourglass-half"></i> ${aluno.notas.fase2.posicao}</p>
                </div>
            </div>
            
            <div class="nota-card">
                <h3><i class="fas fa-clipboard-check"></i> SIMULADOS</h3>
                <div class="nota-valor">${aluno.notas.simulados.nota}%</div>
                <div class="nota-detalhes">
                    <p><i class="fas fa-chart-line"></i> Média: ${aluno.notas.simulados.media_turma}%</p>
                    <p><i class="fas fa-ranking-star"></i> ${aluno.notas.simulados.nota > aluno.notas.simulados.media_turma ? 'Acima da média' : 'Na média'}</p>
                </div>
            </div>
            
            <div class="nota-card">
                <h3><i class="fas fa-dumbbell"></i> TREINAMENTOS</h3>
                <div class="nota-valor">${aluno.notas.treinamentos.nota}%</div>
                <div class="nota-detalhes">
                    <p><i class="fas fa-calendar-check"></i> ${aluno.notas.treinamentos.participacao}</p>
                    <p><i class="fas fa-fire"></i> ${aluno.notas.treinamentos.nota >= 90 ? 'Alta dedicação' : 'Boa dedicação'}</p>
                </div>
            </div>
        </div>
        
        <div class="status-container">
            <div class="media-geral">
                <h3><i class="fas fa-chart-bar"></i> DESEMPENHO GERAL</h3>
                <div class="media-valor">${mediaGeral}%</div>
                <div class="status ${statusClass}">${status}</div>
            </div>
            
            <div class="premiacoes-box">
                <h3><i class="fas fa-trophy"></i> PREMIAÇÕES</h3>
                <div class="premiacoes-lista">
                    ${aluno.premiacoes.length > 0 
                        ? aluno.premiacoes.map(premio => `
                            <div class="premiacao-item">
                                <i class="fas fa-medal"></i>
                                <span>${premio}</span>
                            </div>
                        `).join('')
                        : '<p class="sem-premiacao">Sem premiações anteriores</p>'
                    }
                </div>
            </div>
        </div>
        
        <div class="actions">
            <button class="btn-print" onclick="window.print()">
                <i class="fas fa-print"></i> Imprimir Relatório
            </button>
            <button class="btn-logout" onclick="limparFormulario()">
                <i class="fas fa-redo"></i> Nova Consulta
            </button>
        </div>
    `;
    
    document.getElementById('resultado').innerHTML = resultadoHTML;
    document.getElementById('resultado').style.display = 'block';
    
    // Rolar suavemente até os resultados
    document.getElementById('resultado').scrollIntoView({ behavior: 'smooth' });
}

// ========== FUNÇÃO DE ERRO ==========
function mostrarErro(mensagem) {
    document.getElementById('erro').innerHTML = `
        <div class="erro-content">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>${mensagem}</h3>
            <p class="erro-dica">Verifique se os dados estão corretos.</p>
        </div>
    `;
    document.getElementById('erro').style.display = 'block';
}

// ========== FUNÇÃO LIMPAR FORMULÁRIO ==========
function limparFormulario() {
    document.getElementById('nomeAluno').value = '';
    document.getElementById('cpfAluno').value = '';
    document.getElementById('resultado').style.display = 'none';
    document.getElementById('erro').style.display = 'none';
    listaAutocomplete.style.display = 'none';
    document.getElementById('nomeAluno').focus();
}

// ========== PERMITIR ENTER PARA BUSCAR ==========
document.getElementById('nomeAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        document.getElementById('cpfAluno').focus();
    }
});

document.getElementById('cpfAluno').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        buscarNotas();
    }
});

// ========== FOCAR NO CAMPO DE NOME AO CARREGAR ==========
window.onload = function() {
    document.getElementById('nomeAluno').focus();
    console.log("🚀 Sistema de Consulta de Notas carregado!");
    console.log("📝 Banco de dados com", bancoDeAlunos.length, "alunos");
    console.log("💡 Digite 'JOÃO' ou 'VICTOR' para testar o autocomplete");
};

// ========== ESTILOS PARA O AUTOCOMPLETE E RESULTADOS ==========
const style = document.createElement('style');
style.textContent = `
    .autocomplete-lista {
        position: absolute;
        background: white;
        border: 2px solid #4361ee;
        border-radius: 10px;
        width: 100%;
        max-height: 300px;
        overflow-y: auto;
        z-index: 1000;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        margin-top: 5px;
        display: none;
        top: 100%;
        left: 0;
    }
    
    .autocomplete-item {
        padding: 12px 15px;
        cursor: pointer;
        border-bottom: 1px solid #e2e8f0;
        transition: all 0.2s;
    }
    
    .autocomplete-item:hover {
        background: #f1f5f9;
    }
    
    .autocomplete-item:last-child {
        border-bottom: none;
    }
    
    .autocomplete-nome {
        font-weight: 600;
        color: #1a1a2e;
        margin-bottom: 5px;
        font-size: 1rem;
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .autocomplete-nome strong {
        color: #4361ee;
        font-weight: 700;
    }
    
    .autocomplete-nome i {
        color: #4f46e5;
        font-size: 0.9rem;
    }
    
    .autocomplete-detalhes {
        display: flex;
        flex-direction: column;
        gap: 3px;
        font-size: 0.85rem;
        color: #64748b;
    }
    
    .autocomplete-escola {
        display: flex;
        align-items: center;
        gap: 6px;
        color: #10b981;
        font-weight: 500;
    }
    
    .autocomplete-escola i {
        color: #10b981;
        font-size: 0.8rem;
    }
    
    .autocomplete-sem-resultados {
        padding: 15px;
        text-align: center;
        color: #64748b;
        font-style: italic;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        font-size: 0.9rem;
    }
    
    .autocomplete-sem-resultados i {
        color: #94a3b8;
    }
    
    .feedback-autocomplete {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 10px;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        z-index: 1001;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    }
    
    .feedback-autocomplete i {
        font-size: 1.2rem;
    }
    
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    /* Estilos para resultados */
    .aluno-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
    }
    
    .aluno-nivel {
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        color: white;
        padding: 8px 15px;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.9rem;
    }
    
    .aluno-details {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
        margin-top: 20px;
        background: #f8fafc;
        padding: 20px;
        border-radius: 12px;
    }
    
    .detail-item {
        display: flex;
        align-items: center;
        gap: 10px;
        color: #475569;
    }
    
    .detail-item i {
        color: #4361ee;
        font-size: 1.1rem;
    }
    
    .notas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 20px;
        margin: 25px 0;
    }
    
    .nota-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        text-align: center;
        border: 2px solid #e2e8f0;
        transition: all 0.3s;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
    }
    
    .nota-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(67, 97, 238, 0.1);
        border-color: #4361ee;
    }
    
    .nota-card h3 {
        color: #1a1a2e;
        margin-bottom: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        font-size: 1rem;
    }
    
    .nota-valor {
        font-size: 2.8rem;
        font-weight: bold;
        margin: 15px 0;
        background: linear-gradient(135deg, #4361ee, #3a0ca3);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .nota-detalhes {
        margin-top: 15px;
        font-size: 0.85rem;
        color: #64748b;
    }
    
    .nota-detalhes p {
        margin: 8px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
    }
    
    .status-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 25px;
        margin: 30px 0;
    }
    
    .media-geral, .premiacoes-box {
        background: #f8fafc;
        padding: 25px;
        border-radius: 15px;
        border: 2px solid #e2e8f0;
    }
    
    .media-geral {
        text-align: center;
    }
    
    .media-valor {
        font-size: 3.5rem;
        font-weight: bold;
        margin: 15px 0;
        background: linear-gradient(135deg, #10b981, #059669);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    
    .status {
        display: inline-block;
        padding: 10px 30px;
        border-radius: 25px;
        font-weight: 600;
        font-size: 1.1rem;
        margin-top: 15px;
    }
    
    .aprovado {
        background: linear-gradient(135deg, #10b981, #059669);
        color: white;
    }
    
    .recuperacao {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
    }
    
    .reprovado {
        background: linear-gradient(135deg, #ef4444, #dc2626);
        color: white;
    }
    
    .premiacoes-lista {
        margin-top: 15px;
    }
    
    .premiacao-item {
        display: flex;
        align-items: center;
        gap: 12px;
        margin: 12px 0;
        padding: 12px;
        background: white;
        border-radius: 10px;
        border-left: 4px solid #f59e0b;
    }
    
    .premiacao-item i {
        color: #f59e0b;
        font-size: 1.3rem;
    }
    
    .sem-premiacao {
        color: #64748b;
        text-align: center;
        font-style: italic;
        padding: 20px;
    }
    
    .actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
    }
    
    .btn-print, .btn-logout {
        padding: 14px 30px;
        border: none;
        border-radius: 10px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 10px;
        transition: all 0.3s;
        font-size: 1rem;
    }
    
    .btn-print {
        background: #4361ee;
        color: white;
    }
    
    .btn-print:hover {
        background: #3a0ca3;
        transform: translateY(-2px);
        box-shadow: 0 8px 15px rgba(67, 97, 238, 0.2);
    }
    
    .btn-logout {
        background: #e2e8f0;
        color: #475569;
    }
    
    .btn-logout:hover {
        background: #cbd5e1;
        transform: translateY(-2px);
    }
    
    /* Responsivo */
    @media (max-width: 768px) {
        .autocomplete-lista {
            width: 100%;
        }
        
        .autocomplete-detalhes {
            flex-direction: column;
            gap: 5px;
        }
        
        .autocomplete-escola {
            max-width: 100%;
        }
        
        .aluno-header {
            flex-direction: column;
            gap: 15px;
            text-align: center;
        }
        
        .aluno-details {
            grid-template-columns: 1fr;
        }
        
        .notas-grid {
            grid-template-columns: 1fr;
        }
        
        .status-container {
            grid-template-columns: 1fr;
        }
        
        .actions {
            flex-direction: column;
        }
        
        .btn-print, .btn-logout {
            width: 100%;
            justify-content: center;
        }
        
        .feedback-autocomplete {
            bottom: 15px;
            right: 15px;
            left: 15px;
            max-width: none;
            text-align: center;
            justify-content: center;
            padding: 10px 15px;
        }
    }
`;
document.head.appendChild(style);
