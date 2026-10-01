# Expojud 2026

Página estática publicada pelo GitHub Pages a partir da pasta `docs/` da branch `main`.

Endereço padrão do GitHub Pages: https://bonniekdsg.github.io/expojud26/

## Domínio definitivo

O domínio principal é `expojud2026.mpac.mp.br`; `www.expojud2026.mpac.mp.br` deve redirecionar para ele. A pasta publicada contém `docs/CNAME` apenas com o domínio principal, como exige o GitHub Pages.

Para a equipe responsável pelo DNS do MPAC:

1. Crie um registro DNS `CNAME` para `expojud2026.mpac.mp.br` apontando diretamente para `bonniekdsg.github.io`.
2. Crie outro registro DNS `CNAME` para `www.expojud2026.mpac.mp.br` apontando diretamente para `bonniekdsg.github.io`.
3. Em **Settings → Pages**, confirme que **Custom domain** está como `expojud2026.mpac.mp.br`. Depois que o DNS propagar e o certificado for emitido, habilite **Enforce HTTPS**.

O arquivo `docs/CNAME` configura o domínio no GitHub Pages, mas não cria os registros DNS. Até eles existirem, o domínio personalizado não abrirá; o endereço padrão do GitHub Pages também poderá redirecionar para ele.

## Versão aprovada

A versão de vidro translúcido foi aprovada. A versão anterior permanece na tag `pre-glass-ui-2026-09-30` (commit `3030ab7`). O GitHub Pages publica a branch `main`.

Para visualizar a página localmente, execute na pasta do projeto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Abra http://127.0.0.1:4173/.

A proposta mantém as oito iniciativas e os vídeos de fundo. Inclui controles de navegação e pausa, busca sem distinção de acentos, foco protegido nos diálogos e respeito à preferência de movimento reduzido. A troca automática usa oito segundos para dar tempo de leitura e pausa durante a interação.

Verificação realizada em Chromium: busca e recuperação sem resultados, navegação circular, associação do vídeo à iniciativa, pausa e retomada, detalhes e contatos, Escape e retorno do foco. Layout conferido em larguras de 320, 390, 820 e 1440 pixels. Safari e dispositivos físicos ainda não foram testados.
