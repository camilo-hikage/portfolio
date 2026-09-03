# Camilo Hikage — Parallax

Site de página única com um **hero em parallax de mouse** + malha de partículas.

O hero é adaptado do CodePen
[“mouse parallax demo”](https://codepen.io/dominickolbe/pen/oXPRzR) de dominickolbe,
usando [parallax.js](https://github.com/wagerfield/parallax) e
[particles.js](https://github.com/VincentGarreau/particles.js) (via CDN).

## Estrutura

```
index.html      markup (hero + seções Sobre / Projetos / Contato)
css/style.css    estilos e tema
js/main.js       inicializa parallax.js e particles.js
```

## Rodar localmente

```bash
npx serve .
```

## Publicar (GitHub Pages)

Já inclui `.nojekyll`. Em **Settings → Pages**, selecione a branch `main` / `/ (root)`.

## Personalizar

- Texto do hero e das seções: `index.html`
- Cores e tipografia: `css/style.css`
- Densidade/velocidade das partículas e força do parallax: `js/main.js`
