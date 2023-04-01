import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { useMachine } from 'svelte-robot-factory';
import { prepend } from 'ramda'
import services from './services'
import Api from './lib'

const api = Api.init(services)

const URL = 'https://otherwill.com/api/chat/completions'

const machine = createMachine({
  ready: state(
    transition('query', 'submitting', reduce((ctx, ev) => ({ ...ctx, question: ev.question }))),
    transition('clear', 'ready', reduce((ctx) => ({ ...ctx, hx: [], question: '', thread_id: null }))),
    transition('save', 'connectWallet')
  ),
  submitting: invoke(query,
    transition('done', 'ready', reduce((ctx, { data }) => {
      return ({
        hx: prepend({ question: ctx.question, thread_id: data.thread_id, completion: data.completion }, ctx.hx),
        thread_id: data.thread_id
      })
    })),
    transition('error', 'error')
  ),
  error: state(
    transition('tryAgain', 'ready')
  ),
  connectWallet: invoke(() => {
    api.connect()
    return Promise.resolve(true)
  },
    transition('done', 'showSaveDialog'),
    transition('error', 'ready')
  ),
  showSaveDialog: state(
    transition('submit', 'savePermapage', reduce((ctx, ev) => ({ ...ctx, header: ev.header }))),
    transition('cancel', 'ready')
  ),
  savePermapage: invoke(
    ctx => api.createPage(ctx.header, ctx.hx).toPromise(),
    transition('done', 'confirm', reduce((ctx, ev) => ({ ...ctx, id: ev.data.id }))),
    transition('error', 'error')
  ),
  confirm: state(
    //transition('share', 'share'),
    transition('ready', 'ready', reduce((ctx) => ({ ...ctx, id: null })))
  )
}, () => ({ hx: [] }));

const service = useMachine(machine, () => ({ thread_id: null, hx: [] }));
export default service;

function query({ question, thread_id }) {
  return fetch(URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      input: question,
      model: 'permaweb_cookbook_v0.3.3',
      thread_id: thread_id
    })
  }).then(res => res.ok ? res.json() : Promise.reject(new Error(res.statusCode)))


}

