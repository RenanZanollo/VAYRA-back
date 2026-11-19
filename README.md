# VAYRA-back

API do Roteiro Fim de Ano (Express + MongoDB).

## Rodando

1. Crie um `.env` na raiz:

   ```
   PORT=3000
   MONGO_URI=sua-string-de-conexao-do-mongo
   CLIENT_URL=http://localhost:5173
   ```

   `CLIENT_URL` é opcional (lista separada por vírgula). Sem ela, a API libera `localhost:5173` e `localhost:5174`.

2. Instale e popule o banco (só insere se as coleções estiverem vazias):

   ```
   npm install
   npm run seed
   ```

3. Suba o servidor (reinicia sozinho ao salvar arquivos):

   ```
   npm run dev
   ```

## Rotas

| Método | Rota                      | O que faz                               |
| ------ | ------------------------- | --------------------------------------- |
| GET    | `/`                       | Checagem: a API está de pé?             |
| GET    | `/places`                 | Lista o catálogo de lugares             |
| GET    | `/schedules`              | Lista todos os itens do roteiro         |
| GET    | `/schedules?date=AAAA-MM-DD` | Itens de um dia                      |
| POST   | `/schedules`              | Cria um item (validação → erro 400)     |
| PUT    | `/schedules/:id`          | Atualiza um item (404 se não existir)   |
| DELETE | `/schedules/:id`          | Apaga um item (204; 404 se não existir) |
