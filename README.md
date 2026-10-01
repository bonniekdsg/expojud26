# Expojud 2026

Página estática publicada pelo GitHub Pages a partir da pasta `docs/` da branch `main`.

Prévia para a equipe: https://bonniekdsg.github.io/expojud26/

## Domínio definitivo

O domínio planejado é `expojud2026.mpac.mp.br`, com redirecionamento de `www.expojud2026.mpac.mp.br`. Enquanto a equipe avalia a prévia, o repositório não contém `docs/CNAME` e o campo **Custom domain** em **Settings → Pages** fica vazio. Assim, o endereço de prévia continua acessível.

Após a aprovação, para configurar o domínio definitivo:

1. Em **Settings → Pages**, defina **Custom domain** como `expojud2026.mpac.mp.br`. O GitHub criará `docs/CNAME` com esse único nome.
2. Crie um registro DNS `CNAME` para `expojud2026.mpac.mp.br` apontando diretamente para `bonniekdsg.github.io`.
3. Crie outro registro DNS `CNAME` para `www.expojud2026.mpac.mp.br` apontando diretamente para `bonniekdsg.github.io`.
4. Depois que o DNS propagar e o certificado for emitido, habilite **Enforce HTTPS**.

Ao configurar o domínio personalizado antes do DNS, o endereço de prévia poderá redirecionar para um site ainda indisponível. Se o navegador continuar redirecionando após a remoção do domínio, teste em uma janela anônima ou com um parâmetro novo, como `?preview=1`, para evitar um redirecionamento antigo em cache.

## Versão aprovada

A versão de vidro translúcido foi aprovada. A versão anterior permanece na tag `pre-glass-ui-2026-09-30` (commit `3030ab7`). O GitHub Pages publica a branch `main`.

Para visualizar a página localmente, execute na pasta do projeto:

```sh
python3 -m http.server 4173 --bind 127.0.0.1 --directory docs
```

Abra http://127.0.0.1:4173/.

A proposta mantém as oito iniciativas e os vídeos de fundo. Inclui controles de navegação e pausa, busca sem distinção de acentos, foco protegido nos diálogos e respeito à preferência de movimento reduzido. A troca automática usa oito segundos para dar tempo de leitura e pausa durante a interação.

Verificação realizada em Chromium: busca e recuperação sem resultados, navegação circular, associação do vídeo à iniciativa, pausa e retomada, detalhes e contatos, Escape e retorno do foco. Layout conferido em larguras de 320, 390, 820 e 1440 pixels. Safari e dispositivos físicos ainda não foram testados.
