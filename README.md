# Camilo Hikage — Parallax

Site de página única com dois efeitos de parallax:

1. **Hero** — parallax de mouse + malha de partículas, adaptado do CodePen
   [“mouse parallax demo”](https://codepen.io/dominickolbe/pen/oXPRzR) de dominickolbe
   ([parallax.js](https://github.com/wagerfield/parallax) + [particles.js](https://github.com/VincentGarreau/particles.js)).
2. **Cena de montanhas** (`#cena`) — o CodePen
   [“Parallax scene with CSS variables”](https://codepen.io/electerious/pen/gLLozQ)
   de electerious: [basicScroll](https://github.com/electerious/basicScroll) controla a
   variável CSS `--ty` de cada camada no scroll. As imagens são servidas pelo CDN do
   autor (`s.electerious.com`).

Bibliotecas via CDN (cdnjs / code.jquery.com).

## Estrutura

```
index.html      hero + cena de parallax + seções Sobre / Projetos / Contato
css/style.css    estilos e tema
js/main.js       inicializa parallax.js, particles.js e basicScroll
```

## Rodar localmente

```bash
npx serve .
```

## Publicar (GitHub Pages)

Já inclui `.nojekyll`. Em **Settings → Pages**, selecione a branch `main` / `/ (root)`.
