# Dinâmica Inventários - Sistema de Inventário Patrimonial

Sistema completo de inventário patrimonial desenvolvido em React com Vite, Tailwind CSS e Shadcn/UI, otimizado para dispositivos móveis e com suporte offline.

## 🚀 Funcionalidades

### ✅ Autenticação
- **Login** com validação de formulário
- **Registro** de novos usuários
- **Recuperação de senha**
- Proteção de rotas autenticadas

### ✅ Inventário Patrimonial
- **Formulário completo** com todos os campos solicitados:
  - Código de barras (com simulação de scanner)
  - Descrição detalhada
  - Quantidade e multiplicador
  - Local de armazenamento
  - Unidade de medida
  - Fabricante
  - Estado físico (Novo, Usado, Danificado, Obsoleto)
  - Campos opcionais: número de série, tamanho, observações
  - Upload e captura de fotos

### ✅ Gestão de Clientes
- **Cadastro de clientes** com informações empresariais
- **Busca e filtros** para localização rápida
- **Estatísticas** de clientes e empresas ativas

### ✅ Agendamento de Inventários
- **Criação de agendamentos** para inventários de clientes
- **Gestão de status** (Agendado, Em Andamento, Concluído, Cancelado)
- **Priorização** de tarefas (Baixa, Média, Alta)
- **Calendário** com visualização de próximos agendamentos

### ✅ Funcionalidades Offline
- **Detecção automática** de status de conexão
- **Armazenamento local** de dados quando offline
- **Sincronização automática** quando a conexão é restabelecida
- **Indicador visual** de status offline/online

### ✅ Interface Mobile-First
- **Design responsivo** otimizado para dispositivos móveis
- **Touch-friendly** com botões e elementos adequados para toque
- **PWA ready** com meta tags apropriadas
- **Loading screen** personalizado

## 🛠️ Tecnologias Utilizadas

- **React 18** - Biblioteca principal
- **Vite** - Build tool e servidor de desenvolvimento
- **Tailwind CSS** - Framework de CSS utilitário
- **Shadcn/UI** - Componentes de interface
- **React Router DOM** - Roteamento
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de esquemas
- **Lucide React** - Ícones
- **Class Variance Authority** - Variantes de componentes

## 📱 Compatibilidade

- ✅ **Desktop** - Todas as resoluções
- ✅ **Tablet** - iPad e Android tablets
- ✅ **Mobile** - iPhone e Android phones
- ✅ **PWA** - Instalável como app nativo

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Instalação
```bash
# Clone o repositório
cd dinamica-inventarios

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev

# Acesse http://localhost:5173
```

### Build para Produção
```bash
# Gere os arquivos de produção
npm run build

# Visualize o build localmente
npm run preview
```

## 📋 Como Usar

### 1. Login/Registro
- Acesse a aplicação e faça login ou crie uma nova conta
- Use qualquer email válido e senha com pelo menos 6 caracteres

### 2. Dashboard
- Visualize estatísticas gerais do inventário
- Acesse rapidamente as principais funcionalidades

### 3. Adicionar Itens
- Clique em "Novo Item" para adicionar itens ao inventário
- Preencha todos os campos obrigatórios
- Use o botão de scanner para simular leitura de código de barras
- Adicione fotos usando câmera ou galeria

### 4. Gerenciar Clientes
- Acesse "Clientes" para cadastrar empresas
- Use a busca para encontrar clientes rapidamente
- Agende inventários diretamente do cartão do cliente

### 5. Agendamentos
- Crie agendamentos de inventários para clientes
- Gerencie status e prioridades
- Acompanhe o progresso dos trabalhos

### 6. Modo Offline
- O app funciona offline automaticamente
- Dados são salvos localmente e sincronizados quando online
- Indicador no canto inferior direito mostra o status

## 🎨 Design System

### Cores Principais
- **Primária**: Azul (#2563eb)
- **Secundária**: Cinza (#6b7280)
- **Sucesso**: Verde (#10b981)
- **Erro**: Vermelho (#ef4444)
- **Aviso**: Amarelo (#f59e0b)

### Tipografia
- **Fonte**: System fonts (Inter, SF Pro, Roboto)
- **Tamanhos**: 12px, 14px, 16px, 18px, 24px, 32px

## 📊 Estrutura do Projeto

```
src/
├── components/
│   ├── ui/              # Componentes base (Button, Input, Card)
│   └── OfflineIndicator.jsx
├── contexts/
│   ├── AuthContext.jsx  # Gerenciamento de autenticação
│   └── OfflineContext.jsx # Gerenciamento offline
├── hooks/
│   └── useOnlineStatus.js
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── ForgotPassword.jsx
│   ├── Dashboard.jsx
│   ├── InventoryForm.jsx
│   ├── Clients.jsx
│   └── Schedule.jsx
├── lib/
│   └── utils.js         # Utilitários
└── App.jsx              # Componente principal
```

## 🔒 Segurança

- Validação de formulários no frontend
- Proteção de rotas autenticadas
- Sanitização de dados de entrada
- Armazenamento seguro no localStorage

## 📈 Performance

- **Lazy loading** de componentes
- **Code splitting** automático
- **Otimização de imagens**
- **Caching** de dados offline

## 🌐 Deploy

O projeto está pronto para deploy em:
- **Vercel** (recomendado)
- **Netlify**
- **GitHub Pages**
- **Servidor próprio**

## 📞 Suporte

Para dúvidas ou suporte:
- Email: contato@dinamicainventarios.com.br
- Website: https://dinamicainventarios.com.br

## 📄 Licença

© 2024 Dinâmica Inventários. Todos os direitos reservados.

---

**Desenvolvido com ❤️ para a Dinâmica Inventários**

