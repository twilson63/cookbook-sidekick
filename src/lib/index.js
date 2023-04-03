import { Async } from 'crocks'
import { marked } from 'marked'

export default {
  init: ({ connect, dispatch }) => ({
    connect,
    createPage(header, hx) {
      return Async.of(toHTML(header, hx))
        .chain(html => Async.fromPromise(dispatch)({
          data: html,
          tags: [
            { name: 'Content-Type', value: 'text/html' }
          ]
        }))
    }
  })
}

function toHTML(header, hx) {
  return `<!doctype html>
<html data-theme="corporate">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scalability=1.0" />
    <title>${header.title}</title>
    <meta name="description" content="${header.description}" />

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet">


    <link href="https://cdn.jsdelivr.net/npm/daisyui@2.51.5/dist/full.css" rel="stylesheet" type="text/css" />
    <script src="https://cdn.tailwindcss.com?plugins=typography,aspect-ratio,line-clamp"></script>
  
    <link rel="stylesheet" href="https://unpkg.com/@highlightjs/cdn-assets@11.6.0/styles/github-dark.min.css">

    <script src="https://arweave.net/_d-GsX52lw7Sdg8hgKKWf_lLohaQ8f4zIYmXxHWMgQc"></script>
    <script src="https://unpkg.com/highlightjs-svelte@1.0.6/dist/svelte.min.js"></script>
    <script type="module">hljs.highlightAll();</script>
    <style>
      * {
        font-family: 'Poppins';
      }
    </style>
  </head>
  <body>
    <div class="hero">
      <div class="hero-content flex-col">  
        <h1 class="text-4xl">${header.title}</h1>
        <p>${header.description}</p>
        <hr />
        <div class="prose">
          ${hx.map(createEl).join('')}
        </div>
      </div>
    </div>
  </body>
</html>
  
  `
}

function createEl({ question, completion }) {
  return `
  <div class="card">
    <div class="card-title"><h3>${question}</h3></div>
    <div class="card-body">
      ${marked(completion)}
    </div>
  `
}