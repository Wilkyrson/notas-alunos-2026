<script>
        // DADOS DO PROFESSOR
        const PROFESSOR_DADOS = {
            nome: "WILKYSON CALDAS LIMA",
            cpf: "040.385.812-76",
            senha: "wilkyson2024"
        };

        // BANCO DE DADOS DE ALUNOS (inicial com exemplos)
        let bancoDeAlunos = JSON.parse(localStorage.getItem('bancoDeAlunos')) || [
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
                cpf: "022.935.912-47",
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

        // Salvar banco de dados no localStorage
        function salvarBancoDeDados() {
            localStorage.setItem('bancoDeAlunos', JSON.stringify(bancoDeAlunos));
            console.log("✅ Banco de dados salvo no localStorage");
        }

        // Inicializar o banco de dados
        salvarBancoDeDados();

        // ========== AUTOCOMPLETE DO NOME (CORRIGIDO) ==========
        let timeoutBusca = null;
        const listaAutocomplete = document.createElement('div');
        listaAutocomplete.className = 'autocomplete-lista';

        // Inicializar autocomplete quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            const nomeInput = document.getElementById('nomeAluno');
            if (nomeInput && nomeInput.parentElement) {
                nomeInput.parentElement.style.position = 'relative';
                nomeInput.parentElement.appendChild(listaAutocomplete);
                console.log("✅ Autocomplete configurado");
            }
        });

        // Evento de input no campo nome (AUTOCOMPLETE FUNCIONANDO)
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
                buscarSugestoesNomes(valor);
            }, 300);
        });

        // Fechar autocomplete ao clicar fora
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.autocomplete-lista') && e.target.id !== 'nomeAluno') {
                listaAutocomplete.style.display = 'none';
            }
        });

        // Função de busca para sugestões de nomes (FUNCIONANDO)
        function buscarSugestoesNomes(texto) {
            const textoBusca = texto.toUpperCase().trim();
            
            console.log(`🔍 Buscando sugestões para: "${texto}"`);
            
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
                return nomeAluno.includes(textoBusca);
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
                    mostrarNotificacao('Aluno selecionado. Digite o CPF para continuar.', 'info');
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

        // ========== GERENCIAMENTO DE MODO ==========
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const mode = this.getAttribute('data-mode');
                
                // Atualizar botões ativos
                document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Mostrar seção correta
                document.querySelectorAll('.aluno-section, .professor-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                if (mode === 'aluno') {
                    document.getElementById('aluno-section').classList.add('active');
                    // Limpar autocomplete ao mudar para área do aluno
                    listaAutocomplete.style.display = 'none';
                } else {
                    document.getElementById('professor-section').classList.add('active');
                }
            });
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
            // Esconder autocomplete ao começar a digitar CPF
            listaAutocomplete.style.display = 'none';
        });

        document.getElementById('novoCpf').addEventListener('input', function(e) {
            this.value = formatarCPF(this.value);
        });

        document.getElementById('professorCpf').addEventListener('input', function(e) {
            this.value = formatarCPF(this.value);
        });

        // Permitir Enter para buscar
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

        // ========== LOGIN DO PROFESSOR ==========
        function loginProfessor() {
            const nome = document.getElementById('professorNome').value.trim().toUpperCase();
            const cpf = document.getElementById('professorCpf').value.replace(/\D/g, '');
            const senha = document.getElementById('professorSenha').value;
            
            // Verificar credenciais
            if (nome === PROFESSOR_DADOS.nome && 
                cpf === PROFESSOR_DADOS.cpf.replace(/\D/g, '') && 
                senha === PROFESSOR_DADOS.senha) {
                
                // Login bem-sucedido
                document.getElementById('login-professor').style.display = 'none';
                document.getElementById('dashboard-professor').classList.add('active');
                document.getElementById('professorLogado').textContent = `CPF: ${PROFESSOR_DADOS.cpf}`;
                
                // Carregar dados
                carregarAlunos();
                atualizarEstatisticas();
                preencherSelectAlunos();
                
                mostrarNotificacao('Login realizado com sucesso!', 'success');
                
            } else {
                mostrarNotificacao('Credenciais inválidas! Verifique seus dados.', 'error');
            }
        }

        function logoutProfessor() {
            document.getElementById('login-professor').style.display = 'block';
            document.getElementById('dashboard-professor').classList.remove('active');
            document.getElementById('professorSenha').value = '';
            
            // Voltar para aba de listar alunos
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="listar"]').classList.add('active');
            document.getElementById('tab-listar').classList.add('active');
            
            mostrarNotificacao('Logout realizado com sucesso!', 'info');
        }

        // ========== GERENCIAMENTO DE ABAS ==========
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab');
                
                // Atualizar botões ativos
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Mostrar conteúdo correto
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                document.getElementById(`tab-${tabId}`).classList.add('active');
                
                // Ações específicas por aba
                if (tabId === 'listar') {
                    carregarAlunos();
                } else if (tabId === 'editar') {
                    preencherSelectAlunos();
                }
            });
        });

        // ========== FUNÇÕES DO PAINEL DO PROFESSOR ==========
        function carregarAlunos() {
            const listaAlunos = document.getElementById('listaAlunos');
            
            if (bancoDeAlunos.length === 0) {
                listaAlunos.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #64748b;">
                        <i class="fas fa-user-graduate" style="font-size: 3rem; margin-bottom: 20px; color: #cbd5e1;"></i>
                        <h3>Nenhum aluno cadastrado</h3>
                        <p>Cadastre o primeiro aluno clicando na aba "Cadastrar Aluno"</p>
                    </div>
                `;
                return;
            }
            
            let html = '';
            bancoDeAlunos.forEach((aluno, index) => {
                // Calcular média geral
                const notasValores = [
                    aluno.notas.fase1.nota,
                    aluno.notas.fase2.nota,
                    aluno.notas.simulados.nota,
                    aluno.notas.treinamentos.nota
                ];
                const mediaGeral = (notasValores.reduce((a, b) => a + b, 0) / notasValores.length).toFixed(1);
                
                html += `
                    <div class="aluno-card">
                        <div class="aluno-card-header">
                            <h3><i class="fas fa-user-graduate"></i> ${aluno.nome}</h3>
                            <div class="aluno-card-actions">
                                <button class="action-btn edit" onclick="editarAlunoModal(${index})">
                                    <i class="fas fa-edit"></i> Editar
                                </button>
                                <button class="action-btn delete" onclick="confirmarExclusao(${index})">
                                    <i class="fas fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                        <div class="aluno-card-details">
                            <div>
                                <i class="fas fa-id-card" style="color: #4299e1;"></i>
                                <strong>CPF:</strong> ${aluno.cpf}
                            </div>
                            <div>
                                <i class="fas fa-hashtag" style="color: #4299e1;"></i>
                                <strong>Matrícula:</strong> ${aluno.matricula}
                            </div>
                            <div>
                                <i class="fas fa-school" style="color: #4299e1;"></i>
                                <strong>Escola:</strong> ${aluno.escola}
                            </div>
                            <div>
                                <i class="fas fa-chart-line" style="color: #38a169;"></i>
                                <strong>Média Geral:</strong> ${mediaGeral}%
                            </div>
                        </div>
                    </div>
                `;
            });
            
            listaAlunos.innerHTML = html;
        }

        function editarAlunoModal(index) {
            // Ir para aba de editar
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="editar"]').classList.add('active');
            document.getElementById('tab-editar').classList.add('active');
            
            // Selecionar aluno no dropdown
            const select = document.getElementById('editarAluno');
            select.value = index;
            
            // Carregar dados
            carregarDadosAlunoParaEdicao();
        }

        function atualizarEstatisticas() {
            // Total de alunos
            document.getElementById('totalAlunos').textContent = bancoDeAlunos.length;
            
            // Calcular média geral de todos os alunos
            if (bancoDeAlunos.length > 0) {
                let somaMedias = 0;
                let alunosComNotas = 0;
                
                bancoDeAlunos.forEach(aluno => {
                    const notasValores = [
                        aluno.notas.fase1.nota,
                        aluno.notas.fase2.nota,
                        aluno.notas.simulados.nota,
                        aluno.notas.treinamentos.nota
                    ];
                    const mediaAluno = notasValores.reduce((a, b) => a + b, 0) / notasValores.length;
                    
                    if (!isNaN(mediaAluno)) {
                        somaMedias += mediaAluno;
                        alunosComNotas++;
                    }
                });
                
                const mediaGeral = alunosComNotas > 0 ? (somaMedias / alunosComNotas).toFixed(1) : 0;
                document.getElementById('mediaGeral').textContent = `${mediaGeral}%`;
            } else {
                document.getElementById('mediaGeral').textContent = '0%';
            }
            
            // Contar alunos aguardando fase 2
            const aguardandoFase2 = bancoDeAlunos.filter(aluno => 
                aluno.notas.fase2.posicao === 'Aguardando'
            ).length;
            document.getElementById('aguardandoFase2').textContent = aguardandoFase2;
            
            // Contar alunos classificados na fase 1
            const classificados = bancoDeAlunos.filter(aluno => 
                aluno.notas.fase1.posicao === 'Classificado'
            ).length;
            document.getElementById('classificados').textContent = classificados;
        }

        function preencherSelectAlunos() {
            const select = document.getElementById('editarAluno');
            select.innerHTML = '<option value="">Selecione um aluno...</option>';
            
            bancoDeAlunos.forEach((aluno, index) => {
                const option = document.createElement('option');
                option.value = index;
                option.textContent = `${aluno.nome} (${aluno.matricula})`;
                select.appendChild(option);
            });
        }

        function carregarDadosAlunoParaEdicao() {
            const select = document.getElementById('editarAluno');
            const index = select.value;
            
            if (index === '') {
                document.getElementById('form-editar-notas').style.display = 'none';
                return;
            }
            
            const aluno = bancoDeAlunos[index];
            
            // Preencher campos do formulário
            document.getElementById('editarNotaFase1').value = aluno.notas.fase1.nota;
            document.getElementById('editarAcertosFase1').value = aluno.notas.fase1.acertos;
            document.getElementById('editarPosicaoFase1').value = aluno.notas.fase1.posicao;
            
            document.getElementById('editarNotaFase2').value = aluno.notas.fase2.nota;
            document.getElementById('editarAcertosFase2').value = aluno.notas.fase2.acertos;
            document.getElementById('editarPosicaoFase2').value = aluno.notas.fase2.posicao;
            
            document.getElementById('editarNotaSimulados').value = aluno.notas.simulados.nota;
            document.getElementById('editarMediaSimulados').value = aluno.notas.simulados.media_turma;
            
            document.getElementById('editarNotaTreinamentos').value = aluno.notas.treinamentos.nota;
            document.getElementById('editarParticipacaoTreinamentos').value = 
                aluno.notas.treinamentos.participacao.replace('%', '');
            
            document.getElementById('editarPremiacoes').value = aluno.premiacoes.join(', ');
            
            // Mostrar formulário
            document.getElementById('form-editar-notas').style.display = 'block';
        }

        function salvarEdicaoAluno() {
            const select = document.getElementById('editarAluno');
            const index = select.value;
            
            if (index === '') {
                mostrarNotificacao('Selecione um aluno para editar!', 'error');
                return;
            }
            
            const aluno = bancoDeAlunos[index];
            
            // Atualizar notas
            aluno.notas.fase1.nota = parseFloat(document.getElementById('editarNotaFase1').value) || 0;
            aluno.notas.fase1.acertos = parseInt(document.getElementById('editarAcertosFase1').value) || 0;
            aluno.notas.fase1.posicao = document.getElementById('editarPosicaoFase1').value;
            
            aluno.notas.fase2.nota = parseFloat(document.getElementById('editarNotaFase2').value) || 0;
            aluno.notas.fase2.acertos = parseInt(document.getElementById('editarAcertosFase2').value) || 0;
            aluno.notas.fase2.posicao = document.getElementById('editarPosicaoFase2').value;
            
            aluno.notas.simulados.nota = parseFloat(document.getElementById('editarNotaSimulados').value) || 0;
            aluno.notas.simulados.media_turma = parseFloat(document.getElementById('editarMediaSimulados').value) || 0;
            
            aluno.notas.treinamentos.nota = parseFloat(document.getElementById('editarNotaTreinamentos').value) || 0;
            aluno.notas.treinamentos.participacao = 
                (parseFloat(document.getElementById('editarParticipacaoTreinamentos').value) || 0) + '%';
            
            // Atualizar premiações
            const premiacoesTexto = document.getElementById('editarPremiacoes').value;
            aluno.premiacoes = premiacoesTexto.split(',').map(p => p.trim()).filter(p => p !== '');
            
            // Salvar no localStorage
            salvarBancoDeDados();
            
            // Atualizar interface
            carregarAlunos();
            atualizarEstatisticas();
            preencherSelectAlunos();
            
            mostrarNotificacao('Aluno atualizado com sucesso!', 'success');
            
            // Limpar formulário
            select.value = '';
            document.getElementById('form-editar-notas').style.display = 'none';
        }

        function cadastrarAluno() {
            // Validar campos obrigatórios
            const nome = document.getElementById('novoNome').value.trim().toUpperCase();
            const cpf = document.getElementById('novoCpf').value.replace(/\D/g, '');
            const matricula = document.getElementById('novaMatricula').value.trim();
            const escola = document.getElementById('novaEscola').value.trim();
            const nivel = document.getElementById('novoNivel').value;
            
            if (!nome || !cpf || !matricula || !escola) {
                mostrarNotificacao('Preencha todos os campos obrigatórios!', 'error');
                return;
            }
            
            if (cpf.length !== 11) {
                mostrarNotificacao('CPF inválido! Deve conter 11 dígitos.', 'error');
                return;
            }
            
            // Verificar se CPF já existe
            const cpfExistente = bancoDeAlunos.find(aluno => 
                aluno.cpf.replace(/\D/g, '') === cpf
            );
            
            if (cpfExistente) {
                mostrarNotificacao('CPF já cadastrado no sistema!', 'error');
                return;
            }
            
            // Criar novo aluno
            const novoAluno = {
                nome: nome,
                cpf: formatarCPF(cpf),
                matricula: matricula,
                escola: escola,
                nivel: nivel,
                notas: {
                    fase1: { 
                        nota: parseFloat(document.getElementById('novaNotaFase1').value) || 0,
                        acertos: parseInt(document.getElementById('novaAcertosFase1').value) || 0,
                        posicao: "Aguardando"
                    },
                    fase2: { 
                        nota: parseFloat(document.getElementById('novaNotaFase2').value) || 0,
                        acertos: parseInt(document.getElementById('novaAcertosFase2').value) || 0,
                        posicao: "Aguardando"
                    },
                    simulados: { 
                        nota: parseFloat(document.getElementById('novaNotaSimulados').value) || 0,
                        media_turma: 0
                    },
                    treinamentos: { 
                        nota: parseFloat(document.getElementById('novaNotaTreinamentos').value) || 0,
                        participacao: (parseFloat(document.getElementById('novaParticipacaoTreinamentos').value) || 0) + '%'
                    }
                },
                premiacoes: []
            };
            
            // Adicionar ao banco de dados
            bancoDeAlunos.push(novoAluno);
            
            // Salvar no localStorage
            salvarBancoDeDados();
            
            // Atualizar interface
            carregarAlunos();
            atualizarEstatisticas();
            preencherSelectAlunos();
            
            // Limpar formulário
            limparFormularioCadastro();
            
            // Mostrar mensagem de sucesso
            mostrarNotificacao('Aluno cadastrado com sucesso!', 'success');
            
            // Voltar para a aba de listar alunos
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            document.querySelector('[data-tab="listar"]').classList.add('active');
            document.getElementById('tab-listar').classList.add('active');
        }

        function limparFormularioCadastro() {
            document.getElementById('novoNome').value = '';
            document.getElementById('novoCpf').value = '';
            document.getElementById('novaMatricula').value = '';
            document.getElementById('novaEscola').value = '';
            document.getElementById('novoNivel').value = 'Nível 3 (Ensino Médio)';
            document.getElementById('novaNotaFase1').value = '0';
            document.getElementById('novaAcertosFase1').value = '0';
            document.getElementById('novaNotaFase2').value = '0';
            document.getElementById('novaAcertosFase2').value = '0';
            document.getElementById('novaNotaSimulados').value = '0';
            document.getElementById('novaNotaTreinamentos').value = '0';
            document.getElementById('novaParticipacaoTreinamentos').value = '100';
        }

        function confirmarExclusao(index) {
            if (confirm('Tem certeza que deseja excluir este aluno? Esta ação não pode ser desfeita.')) {
                excluirAluno(index);
            }
        }

        function excluirAluno(index) {
            const alunoExcluido = bancoDeAlunos[index];
            
            // Remover aluno
            bancoDeAlunos.splice(index, 1);
            
            // Salvar no localStorage
            salvarBancoDeDados();
            
            // Atualizar interface
            carregarAlunos();
            atualizarEstatisticas();
            preencherSelectAlunos();
            
            // Limpar formulário de edição se estava editando este aluno
            const select = document.getElementById('editarAluno');
            if (select.value === index.toString()) {
                select.value = '';
                document.getElementById('form-editar-notas').style.display = 'none';
            }
            
            mostrarNotificacao(`Aluno "${alunoExcluido.nome}" excluído com sucesso!`, 'success');
        }

        function exportarDados() {
            const dadosParaExportar = {
                professor: PROFESSOR_DADOS,
                dataExportacao: new Date().toISOString(),
                totalAlunos: bancoDeAlunos.length,
                alunos: bancoDeAlunos
            };
            
            const dadosString = JSON.stringify(dadosParaExportar, null, 2);
            const blob = new Blob([dadosString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup-alunos-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            mostrarNotificacao('Dados exportados com sucesso!', 'success');
        }

        // ========== SISTEMA DE NOTIFICAÇÕES ==========
        function mostrarNotificacao(mensagem, tipo = 'info') {
            // Remover notificação anterior se existir
            const notificacaoAnterior = document.querySelector('.notification');
            if (notificacaoAnterior) notificacaoAnterior.remove();
            
            // Criar nova notificação
            const notificacao = document.createElement('div');
            notificacao.className = `notification ${tipo}`;
            notificacao.innerHTML = `
                <i class="fas fa-${tipo === 'success' ? 'check-circle' : tipo === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
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

        // ========== ÁREA DO ALUNO ==========
        function buscarNotasAluno() {
            const nomeDigitado = document.getElementById('nomeAluno').value.trim().toUpperCase();
            const cpfDigitado = document.getElementById('cpfAluno').value.trim();
            
            // Esconder resultados anteriores
            document.getElementById('resultado-aluno').style.display = 'none';
            document.getElementById('erro-aluno').style.display = 'none';
            listaAutocomplete.style.display = 'none';
            
            // Validação
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
            
            // Buscar aluno
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
                
            }, 1000);
        }

        function exibirResultadosAluno(aluno) {
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
                        <h3><i class="fas fa-
