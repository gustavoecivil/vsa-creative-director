# VSA Creative Director

Estúdio de pré-produção audiovisual estático, orientado ao problema, para **planejar imagens e vídeos com diferentes modelos de IA**.

**Site:** https://gustavoecivil.github.io/vsa-creative-director/

## O que faz

- Escolher cenas e o objetivo visual (imagem, personagem, ambiente, gráficos, vídeo).
- Sugerir o gerador adequado, com catálogo para ChatGPT, Kairogen, Runway, Google Flow, Higgsfield, ComfyUI e FFmpeg.
- Criar e copiar ficha técnica / prompt de imagem ou vídeo sem disparar geração.
- Abrir ChatGPT em outra aba e importar a imagem aprovada depois.
- Guardar imagens por tomada e marcá-las como pendente, aprovada ou reprovada.
- Salvar fichas no `localStorage` e imagens no `IndexedDB`, **exclusivamente no navegador**.
- Importar opcionalmente um plano pessoal em JSON, sem fazer upload para o servidor.
- Exportar fichas em JSON.

## Dados privados e privacidade

Este repositório publica **apenas a interface e dados fictícios de demonstração**. Nenhuma foto pessoal, roteiro aprovado, áudio, credencial, arquivo de cliente ou base de dados do GSA AI Hub está incluído. Os arquivos importados permanecem no navegador do usuário; eles não são carregados automaticamente no GitHub ou em qualquer gerador de IA.

Para importar o plano privado de tomadas, clique **Importar meu plano JSON**, selecione o arquivo com `takes_planned` (ex.: `{ "takes_planned": [ ... ] }`) ou `shots`. O importador lê os dados apenas na aba aberta. Se copiar um prompt para um provedor externo, compartilhe somente o conteúdo que tiver autorização para enviar.

## Limites

- **Não é um backend de geração de IA.** O site **não** chama APIs de vídeo/imagem e **não** automatiza gastos, autenticação ou publicação.
- A geração de imagens no ChatGPT pelo navegador depende dos limites do plano do usuário; uso da OpenAI API é cobrado separadamente.
- Os preços/cotas são indicativos; confira no provedor antes de comprar ou gerar.
- Os arquivos do navegador podem ser perdidos ao limpar os dados do site; exporte as fichas e baixe quadros importantes.
- Não reproduza pesos ou recursos protegidos de softwares proprietários sem autorização.
- GitHub Pages hospeda **somente HTML, CSS e JavaScript**; o serviço Python do Hub local continua separado.

## Desenvolvimento

Abra `index.html` em um navegador moderno ou sirva esta pasta com um servidor estático. Sem dependências externas e sem processo de build. Site publicado por GitHub Pages usando a branch `main`, diretório raiz.

O conceito inspira o projeto audiovisual *O Engenheiro 5.0*: primeiro definir o problema; depois escolher e combinar ferramentas para resolvê-lo.

© 2026 VSA Creative Director. Código disponibilizado para visualização neste repositório; nenhuma licença de reutilização é concedida automaticamente.
