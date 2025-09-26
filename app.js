
// Variável global para armazenar o livro atualmente selecionado
let livroAtualSelecionado = null;

// ========================================
// Cadastro de livros
// ========================================

// abre o modal de cadastro ao clicar no botão "Cadastrar novo"
document.addEventListener('DOMContentLoaded', function() {
	const btnCadastrar = document.getElementById('btn-cadastrar-livro');
	const modalCadastroLivro = new bootstrap.Modal(document.getElementById('modalCadastroLivro'));
	btnCadastrar.addEventListener('click', function() {
		modalCadastroLivro.show();
	});

	// Adiciona evento ao botão "Salvar" do modal de cadastro de livro. Coleta dados do cadastro do livro.
	document.getElementById('btnSalvarLivro').addEventListener('click', async function() {
		const titulo = document.getElementById('tituloLivro').value.trim();
		const autor = document.getElementById('autorLivro').value.trim();
		const ano = document.getElementById('anoLivro').value.trim();
		const editora = document.getElementById('editoraLivro').value.trim();

		// Validação simples dos campos obrigatórios
		if (!titulo || !autor) {
			alert('Preencha título e autor!');
			return;
		}

		// Monta o objeto com os dados do livro
		const livroData = {
			titulo: titulo,
			autoria: autor
		};

		if (ano && !isNaN(parseInt(ano))) { // Verifica se ano é um número válido
			livroData.ano = parseInt(ano); // Converte string para número inteiro
		}

		if (editora) {
			livroData.editora = editora;
		}

		try {
			// Cria FormData para enviar os dados
			const formData = new FormData();
			formData.append('titulo', livroData.titulo);
			formData.append('autoria', livroData.autoria);
			if (livroData.ano) {
				formData.append('ano', livroData.ano);
			}
			if (livroData.editora) {
				formData.append('editora', livroData.editora);
			}

			// Faz a requisição para o backend
			const response = await fetch('http://localhost:5000/livro', {
				method: 'POST', // cria um novo livro
				headers: {
					'Accept': 'application/json'
				},
				body: formData
			});

			if (!response.ok) {
				throw new Error(`Erro ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			// Verifica se o livro foi criado com sucesso
			if (data.id) {
				alert('Livro cadastrado com sucesso!');
				// Remove o foco do botão antes de fechar o modal
				document.getElementById('btnSalvarLivro').blur();
				// Fecha o modal
				modalCadastroLivro.hide();
				// Limpa os campos
				document.getElementById('tituloLivro').value = '';
				document.getElementById('autorLivro').value = '';
				document.getElementById('anoLivro').value = '';
				document.getElementById('editoraLivro').value = '';
				// Recarrega a lista de livros (menu lateral)
				await carregarLivros();
			} else {
				alert('Erro ao cadastrar livro: ' + (data.message || 'Erro desconhecido'));
			}
		} catch (error) {
			alert('Erro ao cadastrar livro: ' + error.message);
		}
	});

	// Carrega a lista de livros ao carregar a página
	carregarLivros();
	
	// Inicializa a tabela de bookmarks vazia
	atualizarTabelaBookmarks([]);
});

// ========================================
// GERENCIA LIVROS (MENU LATERAL)
// ========================================

// Função para carregar todos os livros do backend
async function carregarLivros() {
	try {
		const response = await fetch('http://localhost:5000/livros', {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Erro ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		
		if (data.livros) {
			atualizarTabelaLivros(data.livros);
		}
	} catch (error) {
		console.error('Erro ao carregar livros:', error);
	}
}

// Função para atualizar a tabela com os livros
function atualizarTabelaLivros(livros) {
	const tabela = document.querySelector('.menu_tabela');
	
	// Limpa a tabela atual
	tabela.innerHTML = '';
	
	// Se não há livros, mostra mensagem
	if (livros.length === 0) {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td class="text" colspan="2" style="text-align: center; padding: 20px;">
				<span style="color: #888;">Nenhum livro cadastrado</span>
			</td>
		`;
		tabela.appendChild(tr);
		return;
	}
	
	// Adiciona cada livro na tabela
	livros.forEach(livro => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td class="text">
				<span class="livro-titulo" data-titulo="${livro.titulo}" style="cursor: pointer; color: #007bff;" title="Clique para ver detalhes">${livro.titulo}</span><br>
				<span class="smalltext">${livro.autoria}</span>
			</td>
			<td>
				<span class="material-symbols-outlined delete-btn" data-titulo="${livro.titulo}" style="cursor: pointer;" title="Deletar livro">delete</span>
			</td>
		`;
		tabela.appendChild(tr);
	});
	
	// Adiciona eventos de clique nos títulos dos livros
	document.querySelectorAll('.livro-titulo').forEach(titulo => {
		titulo.addEventListener('click', function() {
			// Remove seleção anterior
			document.querySelectorAll('.livro-titulo').forEach(t => {
				t.style.fontWeight = 'normal';
				t.parentElement.parentElement.style.backgroundColor = '';
			});
			
			// Marca o livro atual como selecionado
			this.style.fontWeight = 'bold';
			this.parentElement.parentElement.style.backgroundColor = '#f8f9fa';
			
			const tituloLivro = this.getAttribute('data-titulo');
			carregarDetalhesLivro(tituloLivro);
		});
	});
	
	// Adiciona eventos de clique nos botões de delete
	document.querySelectorAll('.delete-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const titulo = this.getAttribute('data-titulo');
			deletarLivro(titulo);
		});
	});
}

// ========================================
// DELETAR LIVRO
// ========================================

// Função para deletar um livro
async function deletarLivro(titulo) {
	// Confirma se o usuário realmente quer deletar
	if (!confirm(`Tem certeza que deseja deletar o livro "${titulo}"?`)) {
		return;
	}

	try {
		const response = await fetch(`http://localhost:5000/livro?titulo=${encodeURIComponent(titulo)}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Erro ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		
		if (data.message === 'Livro removido') {
			// Recarrega a página inteira após deletar o livro
			window.location.reload();
		} else {
			alert('Erro ao deletar livro: ' + (data.message || 'Erro desconhecido'));
		}
	} catch (error) {
		alert('Erro ao deletar livro: ' + error.message);
	}
}

// ========================================
// CARREGAR DETALHES DO LIVRO NA ÁREA PRINCIPAL
// ========================================

// Função para carregar os detalhes de um livro específico
async function carregarDetalhesLivro(titulo) {
	try {
		const response = await fetch(`http://localhost:5000/livro?titulo=${encodeURIComponent(titulo)}`, {
			method: 'GET',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Erro ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		
		if (data.id) {
			atualizarConteudoPrincipal(data);
		} else {
			alert('Erro ao carregar detalhes do livro: ' + (data.message || 'Livro não encontrado'));
		}
	} catch (error) {
		alert('Erro ao carregar detalhes do livro: ' + error.message);
	}
}

// Função para atualizar o conteúdo principal com os dados do livro
function atualizarConteudoPrincipal(livro) {
	// Armazena o livro selecionado globalmente
	livroAtualSelecionado = livro;
	
	// Atualiza o título principal
	const tituloPrincipal = document.querySelector('.titulo_principal');
	if (tituloPrincipal) {
		tituloPrincipal.textContent = livro.titulo;
	}
	
	// Monta a string com autor, editora e ano
	let subtitulo = livro.autoria;
	if (livro.editora) {
		subtitulo += `, ${livro.editora}`;
	}
	if (livro.ano) {
		subtitulo += `, ${livro.ano}`;
	}
	
	// Atualiza o subtítulo
	const subtituloElement = document.querySelector('.topo_conteudo h4');
	if (subtituloElement) {
		subtituloElement.textContent = subtitulo;
	}
	
	// Atualiza os bookmarks do livro
	atualizarTabelaBookmarks(livro.bookmarks || []);
	
	console.log('Livro carregado:', livro);
}

// ==================================================
// ADICIONAR E DELETAR BOOKMARKS AO LIVRO SELECIONADO
// ==================================================


// Evento do formulário de bookmark - usar livros existentes
document.querySelector('.form-comentario').addEventListener('submit', function(e) {
	e.preventDefault();
	
	// Verifica se há um livro selecionado
	if (!livroAtualSelecionado) {
		alert('Selecione um livro primeiro!');
		return;
	}

	const pagina = document.getElementById('paginaComentario').value;
	const comentario = document.getElementById('comentario').value;

	// Validação simples
	if (!pagina || !comentario) {
		alert('Preencha página e comentário!');
		return;
	}

	// Dados do bookmark associado ao livro selecionado (id do livro)
	const bookmarkData = {
		livro_id: livroAtualSelecionado.id,
		pagina: parseInt(pagina), // Converte string para número
		texto: comentario.trim() // Remove espaços extras
	};

	adicionarBookmark(bookmarkData);
});

// Função para adicionar um bookmark
async function adicionarBookmark(bookmarkData) {
	try {
		// Cria FormData para enviar os dados
		const formData = new FormData();
		formData.append('livro_id', bookmarkData.livro_id);
		formData.append('pagina', bookmarkData.pagina);
		formData.append('texto', bookmarkData.texto);

		const response = await fetch('http://localhost:5000/bookmark', {
			method: 'POST',
			headers: {
				'Accept': 'application/json'
			},
			body: formData
		});

		if (!response.ok) {
			throw new Error(`Erro ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		
		if (data.id) {
			// Limpa o formulário
			document.getElementById('paginaComentario').value = '';
			document.getElementById('comentario').value = '';
			// Atualiza o livro com os novos bookmarks
			atualizarConteudoPrincipal(data);
		} else {
			alert('Erro ao adicionar bookmark: ' + (data.message || 'Erro desconhecido'));
		}
	} catch (error) {
		alert('Erro ao adicionar bookmark: ' + error.message);
	}
}

// Função para atualizar a tabela de bookmarks
function atualizarTabelaBookmarks(bookmarks) {
	const tabela = document.querySelector('.comentario-tabela');
	
	// Limpa a tabela atual
	tabela.innerHTML = '';
	
	// Se não há bookmarks, mostra mensagem
	if (bookmarks.length === 0) {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td colspan="3" style="text-align: center; padding: 20px;">
				<span style="color: #888;">Nenhum bookmark cadastrado</span>
			</td>
		`;
		tabela.appendChild(tr);
		return;
	}
	
	// Adiciona cada bookmark na tabela
	bookmarks.forEach(bookmark => {
		const tr = document.createElement('tr');
		tr.innerHTML = `
			<td class="comentario-pagina-td">
				<span class="material-symbols-outlined">bookmark</span>
				<div class="text">${bookmark.pagina}</div>
			</td>
			<td class="comentario-conteudo-td">
				<div class="text">${bookmark.texto}</div>
			</td>
			<td class="comentario-acoes-td">
				<span class="material-symbols-outlined delete-bookmark-btn" data-bookmark-id="${bookmark.id}" style="cursor: pointer;" title="Deletar bookmark">delete</span>
			</td>
		`;
		tabela.appendChild(tr);
	});
	
	// Adiciona eventos de clique nos botões de delete de bookmarks
	document.querySelectorAll('.delete-bookmark-btn').forEach(btn => {
		btn.addEventListener('click', function() {
			const bookmarkId = this.getAttribute('data-bookmark-id');
			deletarBookmark(bookmarkId);
		});
	});
}

// Função para deletar um bookmark
async function deletarBookmark(bookmarkId) {
	// Confirma se o usuário realmente quer deletar
	if (!confirm('Tem certeza que deseja deletar este bookmark?')) {
		return;
	}

	try {
		const response = await fetch(`http://localhost:5000/bookmark?id=${bookmarkId}`, {
			method: 'DELETE',
			headers: {
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error(`Erro ${response.status}: ${response.statusText}`);
		}

		const data = await response.json();
		
		if (data.message === 'Bookmark removido') {
			// Recarrega os detalhes do livro para atualizar a lista de bookmarks
			if (livroAtualSelecionado) {
				await carregarDetalhesLivro(livroAtualSelecionado.titulo);
			}
		} else {
			alert('Erro ao deletar bookmark: ' + (data.message || 'Erro desconhecido'));
		}
	} catch (error) {
		alert('Erro ao deletar bookmark: ' + error.message);
	}
}


