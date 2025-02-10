## Git

## Folder Structure (general)

```bash

/my-nest-project
│
├── /src
│   ├──app/                    # Código-fonte do projeto
│       ├── /modules            # Módulos do projeto (cada módulo com uma função específica)
│       │   ├── /auth           # Exemplo de módulo de autenticação
│       │   │   ├── /dto        # Data Transfer Objects (DTOs)
│       │   │   ├── /entities   # Entidades do banco de dados
│       │   │   ├── /services   # Serviços de negócios
│       │   │   ├── /controllers# Controladores de rotas
│       │   │   └── /guards     # Guards para proteção de rotas
│       │   └── /user           # Exemplo de módulo de usuário
│       │
│       │
│       ├── /config             # Arquivos de configuração
│       │   └── /app.config.ts  # Configurações gerais da aplicação
│       │
│       ├── /main.ts            # Ponto de entrada principal da aplicação
│       ├── /app.module.ts      # Módulo raiz da aplicação
│       ├── /app.service.ts      # Módulo raiz da aplicação
│       └── /app.controller.ts  # Controlador principal
│
├── /node_modules           # Dependências do projeto
├── /test                   # Testes unitários e integração
│   ├── /auth.controller.spec.ts
│   └── /user.service.spec.ts
├── /dist                   # Arquivos compilados (gerados automaticamente após build)
├── /package.json           # Dependências e scripts do projeto
├── /tsconfig.json          # Configuração do TypeScript
├── /nest-cli.json          # Configuração do CLI do NestJS
└── /README.md              # Documentação do projeto
```
