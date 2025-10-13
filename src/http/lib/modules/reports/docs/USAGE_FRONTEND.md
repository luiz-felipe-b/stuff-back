# Novo fluxo de upload de relatórios (S3 Presigned URL)

## Passos para o frontend/cliente

1. **Solicitar uma presigned URL para upload**
   - Endpoint: `POST /reports/presigned-url`
   - Body: `{ "filename": "nome-do-arquivo.csv" }`
   - Resposta: `{ "url": "...", "key": "..." }`

2. **Fazer upload direto do arquivo para o S3**
   - Use a URL retornada (`url`) para fazer um `PUT` do arquivo CSV diretamente para o S3.
   - Exemplo (fetch):
     ```js
     await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': 'text/csv' } });
     ```

3. **Registrar o relatório no backend**
   - Endpoint: `POST /reports`
   - Body:
     ```json
     {
       "authorId": "..."
       "organizationId": "...",
       "title": "...",
       "key": "<valor de key retornado no passo 1>"
     }
     ```
   - O backend irá montar a URL final do arquivo automaticamente.

## Observações
- O campo `key` é obrigatório e deve ser exatamente o valor retornado pelo endpoint de presigned URL.
- Não envie a URL do arquivo, apenas a key.
- O backend irá validar e montar a URL final para persistência.
