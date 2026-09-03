# Portfólio

Site pessoal de página única com um **hero em parallax** de camadas — cada camada
se move a uma velocidade diferente conforme a página rola, criando profundidade.

A arte do topo é adaptada do
[parallax de Empathetic Polyglot](https://codepen.io/empatheticpolyglot/pen/LWBLNW)
(ilustrações originais de *Firewatch* / Campo Santo), com o logotipo **FIREWATCH**
removido da camada central.

## Estrutura

```
index.html            markup da página
css/style.css          estilos + tokens de tema (claro/escuro)
js/parallax.js         efeito de parallax (rAF, respeita prefers-reduced-motion)
images/parallax/       9 camadas (@1x e @2x)
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
- Cores e intensidade do parallax (`--hero-scroll`): `css/style.css`
- Velocidade de cada camada: atributo `data-speed` em `index.html`
