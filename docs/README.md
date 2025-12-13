# Sistema de Verificação de Disponibilidade de Modelos LLM

## Visão Geral

Este sistema permite verificar quais modelos de linguagem (LLM) estão disponíveis para uso baseado nas chaves de API configuradas no arquivo `.env` do servidor.

## Como Funciona

### 1. Configuração das Variáveis de Ambiente

No arquivo `server/.env`, configure as chaves de API dos modelos que deseja usar:

```env
# OpenAI (para GPT models)
OPENAI_API_KEY="sua_chave_openai"

# Anthropic (para Claude models)
ANTHROPIC_API_KEY="sua_chave_anthropic"

# Cohere
COHERE_API_KEY="sua_chave_cohere"

# Mistral
MISTRAL_API_KEY="sua_chave_mistral"

# Gemini
GEMINI_API_KEY="sua_chave_gemini"
```

### 2. Verificação Server-Side

O servidor verifica automaticamente quais modelos estão disponíveis baseado nas chaves configuradas:

- **Arquivo**: `server/src/utils.ts`
- **Função**: `getAvailableModels()`
- **Lógica**: Retorna `true` se a chave da API existe, `false` caso contrário

### 3. Endpoint de API

O servidor expõe um endpoint para consultar modelos disponíveis:

- **URL**: `GET /models/available`
- **Resposta**: JSON com status de cada modelo
- **Exemplo**:
```json
{
  "gpt": true,
  "gptTurbo": true,
  "claude": false,
  "claudeInstant": false,
  "cohere": true,
  "cohereWeb": true,
  "mistral": false,
  "gemini": true
}
```

### 4. Interface do Usuário

No app React Native, o modal de seleção de modelos:

- Faz uma requisição para `/models/available` ao abrir
- Mostra indicadores visuais de status (verde/vermelho)
- Desabilita modelos indisponíveis
- Exibe texto "Disponível" ou "Indisponível"

## Vantagens desta Abordagem

1. **Segurança**: Não expõe chaves de API no frontend
2. **Performance**: Uma única requisição em vez de múltiplas verificações
3. **Centralização**: Lógica de verificação concentrada no servidor
4. **Simplicidade**: Baseado apenas na presença das variáveis de ambiente
5. **Manutenibilidade**: Fácil de adicionar novos modelos

## Estrutura de Arquivos

```
rn-ai/
├── server/
│   ├── .env                    # Configuração das chaves de API
│   └── src/
│       ├── index.ts           # Endpoint /models/available
│       └── utils.ts           # Função getAvailableModels()
└── app/
    └── src/
        └── components/
            └── ChatModelModal.tsx  # Interface com indicadores visuais
```

## Como Adicionar um Novo Modelo

1. Adicione a chave da API no `server/.env`
2. Inclua o modelo na função `getAvailableModels()` em `utils.ts`
3. Adicione o modelo no array `MODELS` em `app/constants.ts`

O sistema automaticamente detectará e exibirá o novo modelo com seu status de disponibilidade.