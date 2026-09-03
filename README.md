# Portfólio

Site pessoal de página única.

- **Hero "Explore the Space"**: 3 camadas de fundo (nebulosa + estrelas) que dão
  zoom conforme a página rola.
- **Seção "Planetas"**: Neptune, Jupiter e Saturn animam ao entrar na tela.

A arte é **SVG própria**, gerada por `.claude/gen-space.js`. O efeito é adaptado
do gist [Space Explore](https://gist.github.com/krishnaPC/969d74c4fc13285ee77e77269288dd11)
de krishnaPC (sem sequestrar o scroll).

## Estrutura

```
index.html             markup da página
css/style.css           estilos + tokens de tema (espaço)
js/space.js             zoom do hero (--p) + reveal dos planetas
images/space/           bg-1..3, neptune, jupiter, saturn (SVG)
.claude/gen-space.js    gerador da arte (node .claude/gen-space.js)
```

## Rodar localmente

```bash
npx serve .
```

## Publicar (GitHub Pages)

O repositório já inclui `.nojekyll`. Em **Settings → Pages**, selecione a branch
`main` / pasta `/ (root)`.

## Personalizar

- Nome, textos e nomes dos planetas: `index.html`
- Cores do tema e intensidade do zoom (`--hero-scroll`): `css/style.css`
- Força do zoom por camada: `#bg-1/#bg-2/#bg-3` em `css/style.css`
- Arte (nebulosa, estrelas, planetas): `.claude/gen-space.js`, depois
  `node .claude/gen-space.js` para regerar os SVGs
