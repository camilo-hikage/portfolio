# Portfólio

Site pessoal de página única com um **hero em parallax**: a Lua com vista para a
Terra. Cada camada se move a uma velocidade diferente conforme a página rola,
criando profundidade.

A arte do topo é **SVG própria**, gerada por `.claude/gen-moon.js`. A técnica de
camadas é inspirada no
[parallax de Empathetic Polyglot](https://codepen.io/empatheticpolyglot/pen/LWBLNW).

## Estrutura

```
index.html            markup da página
css/style.css          estilos + tokens de tema (espaço)
js/parallax.js         efeito de parallax (respeita prefers-reduced-motion)
images/moon/           camadas SVG: stars, earth, ridge-1..5, foreground
.claude/gen-moon.js    gerador da arte SVG (node .claude/gen-moon.js)
```

## Rodar localmente

Qualquer servidor estático:

```bash
npx serve .
```

## Publicar (GitHub Pages)

O repositório já inclui `.nojekyll`. Em **Settings → Pages**, selecione a branch
`main` / pasta `/ (root)`.

## Personalizar

- Nome, atuação e textos: `index.html`
- Cores do tema e intensidade do parallax (`--hero-scroll`): `css/style.css`
- Velocidade de cada camada: atributo `data-speed` em `index.html`
- Arte da Lua/Terra (cristas, crateras, continentes, estrelas): `.claude/gen-moon.js`,
  depois rode `node .claude/gen-moon.js` para regerar os SVGs
