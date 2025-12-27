// Banco de dados simulado com CPF
const bancoDeAlunos = [
    {
        nome: "MARIA SILVA SANTOS",
        cpf: "123.456.789-00",
        matricula: "20240001",
        notas: {
            portugues: { nota: 8.5, faltas: 2 },
            matematica: { nota: 9.0, faltas: 1 },
            historia: { nota: 7.8, faltas: 3 },
            geografia: { nota: 8.2, faltas: 0 },
            ciencias: { nota: 9.5, faltas: 1 },
            ingles: { nota: 8.7, faltas: 2 },
            educacao_fisica: { nota: 9.0, faltas: 1 },
            artes: { nota: 8.8, faltas: 0 }
        }
    },
    {
        nome: "JOAO PEDRO OLIVEIRA",
        cpf: "987.654.321-00",
        matricula: "20240002",
        notas: {
            portugues: { nota: 6.5, faltas: 5 },
            matematica: { nota: 5.8, faltas: 7 },
            historia: { nota: 7.0, faltas: 4 },
            geografia: { nota: 6.2, faltas: 6 },
            ciencias: { nota: 5.5, faltas: 8 },
            ingles: { nota: 6.9, faltas: 3 },
            educacao_fisica: { nota: 8.0, faltas: 2 },
            artes: { nota: 7.5, faltas: 1 }
        }
    },
    {
        nome: "ANA CLARA COSTA",
        cpf: "456.789.123-00",
        matricula: "20240003",
        notas: {
            portugues: { nota: 9.2, faltas: 0 },
            matematica: { nota: 9.8, faltas: 1 },
            historia: { nota: 8.5, faltas: 2 },
            geografia: { nota: 9.0, faltas: 0 },
            ciencias: { nota: 9.7, faltas: 1 },
            ingles: { nota: 9.4, faltas: 0 },
            educacao_fisica: { nota: 9.5, faltas: 0 },
            artes: { nota: 9.6, faltas: 0 }
        }
    },
    {
        nome: "PEDRO HENRIQUE LIMA",
        cpf: "111.222.333-44",
        matricula: "20240004",
        notas: {
            portugues: { nota: 4.5, faltas: 8 },
            matematica: { nota: 3.8, faltas: 10 },
            historia: { nota: 5.0, faltas: 7 },
            geografia: { nota: 4.2, faltas: 9 },
            ciencias: { nota: 3.5, faltas: 12 },
            ingles: { nota: 4.9, faltas: 6 },
            educacao_fisica: { nota: 8.5, faltas: 3 },
            artes: { nota: 6.0, faltas: 4 }
        }
    },
    {
        nome: "JULIANA ALMEIDA",
        cpf: "555.666.777-88",
        matricula: "20240005",
        notas: {
            portugues: { nota: 7.0, faltas: 3 },
            matematica: { nota: 6.5, faltas: 4 },
            historia: { nota: 7.8, faltas: 2 },
            geografia: { nota: 6.9, faltas: 3 },
            ciencias: { nota: 7.2, faltas: 1 },
            ingles: { nota: 7.5, faltas: 2 },
            educacao_fisica: { nota: 8.8, faltas: 0 },
            artes: { nota: 8.0, faltas: 1 }
        }
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
    
    // Simular busca (em produção seria instantâneo)
    setTimeout(() => {
        document.getElementById('loading').style.display = 'none';
        
        // Buscar aluno (verifica nome E CPF)
        const aluno = bancoDeAlunos.find(a => 
            a.nome === nome && a.cpf === cpf
        );
        
        if (aluno) {
            exibirNotas(aluno);
            registrarAcesso(aluno.nome, 'sucesso');
        } else {
            // Tentar encontrar com nome similar (case-insensitive)
            const alunoSimilar = bancoDeAlunos.find(a => 
                a.nome.toUpperCase() === nome && a.cpf === cpf
            );
            
            if (alunoSimilar) {
                exibirNotas(alunoSimilar);
                registrarAcesso(alunoSimilar.nome, 'sucesso');
            } else {
                mostrarErro('Credenciais inválidas. Verifique se o nome e CPF estão corretos.');
                registrarAcesso(nome, 'falha', cpf);
            }
        }
    }, 1500);
}

function exibirNotas(aluno) {
    // Calcular média
    const notas = Object.values(aluno.notas).map(n => n.nota);
    const media = (notas.reduce((a, b) => a + b, 0) / notas.length).toFixed(1);
    
    // Calcular frequência
    const totalFaltas = Object.values(aluno.notas).reduce((total, materia) => total + materia.faltas, 0);
    const frequencia = Math.max(0, 100 - (totalFaltas * 1.5)).toFixed(1); // 1.5% por falta
    
    // Determinar status
    let status, statusClass;
    if (media >= 7 && frequencia >= 75) {
        status = "APROVADO";
        statusClass = "aprovado";
    } else if (media >= 5 && frequencia >= 75) {
        status = "RECUPERAÇÃO";
        statusClass = "recuperacao";
    } else {
        status = "REPROVADO";
        statusClass = "reprovado";
    }
    
    // Determinar mensagem personalizada
    let mensagemStatus = '';
    if (status === "APROVADO") {
        mensagemStatus = 'Parabéns! Continue com o bom desempenho.';
    } else if (status === "RECUPERAÇÃO") {
        mensagemStatus = 'Atenção! Estude para as provas de recuperação.';
    } else {
        mensagemStatus = 'Entre em contato com a coordenação pedagógica.';
    }
    
    // Gerar HTML das notas
    let notasHTML = '';
    for (const [materia, dados] of Object.entries(aluno.notas)) {
        const materiaFormatada = materia.replace(/_/g, ' ').toUpperCase()
            .split(' ')
            .map(palavra => palavra.charAt(0) + palavra.slice(1).toLowerCase())
            .join(' ');
        
        // Determinar cor da nota
        let corNota = '';
        if (dados.nota >= 7) corNota = 'color: #10b981;';
        else if (dados.nota >= 5) corNota = 'color: #f59e0b;';
        else corNota = 'color: #ef4444;';
        
        notasHTML += `
            <div class="nota-card">
                <h3>${materiaFormatada}</h3>
                <div class="nota-valor" style="${corNota}">${dados.nota.toFixed(1)}</div>
                <div class="nota-faltas">
                    <i class="fas fa-calendar-times"></i> ${dados.faltas} falta(s)
                </div>
                <div class="nota-status" style="margin-top: 8px; font-size: 0.
