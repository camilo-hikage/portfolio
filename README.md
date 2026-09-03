# Portfólio

Site pessoal de página única.

- **Hero "pôr do sol → noite"**: uma cena de colinas em camadas onde o céu, o sol,
  as nuvens e as estrelas mudam conforme a página rola (variável `--p`, de 0 a 1).
- **Seção "Planetas"**: Neptune, Jupiter e Saturn animam ao entrar na tela.

Toda a arte é **SVG própria**, gerada por scripts em `.claude/`.

## Estrutura

```
index.html             markup da página
css/style.css           estilos + tokens de tema
js/hero.js              --p do hero (pôr do sol -> noite) + reveal dos planetas
images/hills/           sol, nuvens, pássaro, estrelas e 6 colinas (SVG)
images/space/           neptune, jupiter, saturn (SVG)
.claude/gen-hills.js    gerador da cena do hero  (node .claude/gen-hills.js)
.claude/gen-space.js    gerador dos planetas     (node .claude/gen-space.js)
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
- Cores do céu, duração da transição (`--hero-scroll`) e parallax das colinas: `css/style.css`
- Formato das colinas, cores, nuvens, estrelas: `.claude/gen-hills.js` + `node .claude/gen-hills.js`
