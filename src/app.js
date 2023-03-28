import { createMachine, state, transition, invoke, reduce } from 'robot3';
import { useMachine } from 'svelte-robot-factory';
import { prepend } from 'ramda'

const URL = 'https://otherwill-git-thread-otherwill.vercel.app/api/chat/completions'

const machine = createMachine({
  ready: state(
    transition('query', 'submitting', reduce((ctx, ev) => ({ ...ctx, question: ev.question }))),
    transition('clear', 'ready', reduce((ctx) => ({ ...ctx, hx: [], question: '', thread_id: null })))
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
  }).then(res => res.json())
  //.then(x => (console.log(x), x))

}
