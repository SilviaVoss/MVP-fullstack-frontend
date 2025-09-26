# 📚 Bookmark - Frontend

## Descrição

Interface web para o sistema de gerenciamento de livros e bookmarks. Ferramenta ideal para usar **durante a leitura** de livros, permitindo registrar passagens importantes, reflexões e comentários com referência à página específica. 

## 🚀 Funcionalidades

### 📖 **Gerenciamento de Livros**
- ✅ Listar todos os livros cadastrados
- ✅ Cadastrar novo livro (título, autor, editora, ano)
- ✅ Visualizar detalhes do livro selecionado
- ✅ Deletar livros existentes

### 🔖 **Sistema de Bookmarks**
- ✅ Adicionar comentários com página específica
- ✅ Visualizar todos os bookmarks do livro
- ✅ Deletar bookmarks individuais
- ✅ Interface intuitiva para navegação

## 🛠️ Tecnologias

- **HTML5** - Estrutura semântica
- **CSS3** - Estilização customizada
- **JavaScript** - Lógica da aplicação com async/await
- **Bootstrap** - Para modais e formulários
- **Google Fonts** - Tipografia (Outfit + Noto Sans)
- **Material Symbols** - Ícones (Google)

## 📁 Estrutura do Projeto

```
MVP_Front/
├── index.html          # Página principal
├── app.js              # Lógica da aplicação
├── app.css             # Estilos customizados
├── README.md           # Documentação
└── images/             # Assets visuais
    ├── logo.png        # Logotipo
    ├── livro.png       # Ícone de livro
```

## ⚙️ Como Executar

### Pré-requisitos
- **Backend rodando** em `http://localhost:5000`
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

### Passos
1. **Clone/baixe** o projeto
2. **Navegue** até a pasta `MVP_Front`
3. **Abra** o arquivo `index.html` em um navegador
   - Duplo clique no arquivo, ou
   - Clique com botão direito → "Abrir com" → navegador

## 🔗 API Integration

O frontend consome a API REST do backend através dos endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| `GET` | `/livros` | Lista todos os livros |
| `GET` | `/livro?titulo=` | Busca livro por título |
| `POST` | `/livro` | Cadastra novo livro |
| `DELETE` | `/livro?titulo=` | Remove livro |
| `POST` | `/bookmark` | Adiciona bookmark |
| `DELETE` | `/bookmark?id=` | Remove bookmark |

## 🎯 Principais Funcionalidades Técnicas

### **Comunicação Assíncrona**
- Todas as requisições HTTP usam `async/await`
- FormData para compatibilidade com backend 

### **Interface Dinâmica**
- Atualização em tempo real das listas
- Feedback visual imediato nas ações
- Validação de formulários
- Tratamento de erros

## 📄 Licença

Este projeto é parte de um MVP acadêmico para a disciplina Desenvolvimento Full Stack Básico da pós gradução Engenharia de Software da PUC-RJ.

## 👨‍💻 Desenvolvimento

**Versão:** 1.0.0  
**Última atualização:** Setembro 2025
**Desenvolvido por:** Sílvia Maria Voss Rodrigues
