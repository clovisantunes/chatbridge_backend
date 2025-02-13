# WhatsApp Integration Service

### Este é um serviço backend desenvolvido com NestJS para integrar com o WhatsApp, permitindo o envio e recebimento de mensagens em tempo real, além de possibilitar a interação com a API do WhatsApp através de WebSockets e autenticação via JWT.

## Funcionalidades
- Recebimento de mensagens via API
- Envio de mensagens para o WhatsApp
- Notificação em tempo real usando WebSockets
- Autenticação com JWT para garantir segurança nas requisições
- Tecnologias Utilizadas
- NestJS: Framework para construir a API
- Socket.IO: Comunicação em tempo real via WebSockets
- JWT: Para autenticação e segurança
- TypeScript: Linguagem de desenvolvimento
- Class-validator: Validação de entradas e DTOs


# Estrutura do Projeto
## O projeto está estruturado da seguinte maneira:

### controllers: Contém os controladores responsáveis pelas rotas de entrada de API.

- services: Contém os serviços responsáveis pela lógica de negócio.
- config: Arquivos de configuração, como o JWT e o WebSocket.
- modules: Módulos que agrupam controladores e serviços relacionados.

### Rotas Disponíveis

#### 1. /whatsapp/messages

- **Método:** GET
- **Descrição:** Retorna todas as mensagens armazenadas no sistema.
- **Autenticação:** Requer JWT no cabeçalho (`Authorization: Bearer <token>`).
- **Resposta:**
  ```json
  {
    "success": true,
    "messages": [
      {
        "id": "1",
        "sender": "John Doe",
        "content": "Hello, World!",
        "timestamp": "2025-02-12T12:00:00Z"
      },
      ...
    ]
  }

### 2. /whatsapp/send
- **Método:** POST
- **Descrição:** Envia uma mensagem para um número do WhatsApp.
- **Body:**
  ```json
  {
    "phoneNumber": "5511912345678",
    "message": "Olá, tudo bem?"
  }
```json

- Resposta:
- **json** 
- **Copiar**
- **Editar**
{
  "success": true,
  "message": "Message sent successfully!"
}
```

## 3. /whatsapp/receive
Método: POST
Descrição: Recebe uma mensagem do WhatsApp e a envia para todos os clientes conectados via WebSocket.
Body:
json
Copiar
Editar
```
{
  "sender": "5511912345678",
  "message": "Nova mensagem!"
}
Resposta:
json
Copiar
Editar
{
  "success": true,
  "message": "Message received and broadcasted"
}
`````

 - WebSocket - Comunicação em Tempo Real
- Evento: newMessage
- Descrição: Emite uma nova mensagem para todos os clientes conectados.
- Formato da Mensagem:
- json
- Copiar
- Editar
````
{
  "sender": "5511912345678",
  "message": "Mensagem recebida com sucesso!"
}
````
## Autenticação JWT
#### Todas as rotas protegidas exigem um token JWT válido para autenticação. O token pode ser obtido após o login, com as credenciais apropriadas.


## Execute o projeto:

- bash
- Copiar
- Editar
- npm run start
## Testando
### Utilize o Postman ou cURL para testar as rotas da API. Para a rota de WebSocket, você pode usar um cliente como Socket.IO Client para conectar e ouvir os eventos newMessage.

# Contribuição
- Faça um fork do projeto
- Crie uma branch para sua feature (git checkout -b feature/feature-name)
- Faça o commit das suas alterações (git commit -am 'Add new feature')
- Push para a branch (git push origin feature/feature-name)
- Crie um pull request
- Licença
- Distribuído sob a licença MIT. Veja LICENSE para mais informações.