import React, { FC } from 'react';
import { assign, createMachine, DoneInvokeEvent } from 'xstate';
import { useMachine } from '@xstate/react';

const apiUrl = 'http://localhost:8080/polling';

type Context = { counter: number | undefined };

type FetchedEvent = DoneInvokeEvent<number>;

const machine = createMachine({
  id: 'PollingMachine',
  initial: 'ready',
  context: { counter: undefined },
  states: {
    ready: {
      on: { START_POLLING: { target: 'fetching' } },
    },
    fetching: {
      invoke: {
        src: () =>
          fetch(apiUrl)
            .then((response) => {
              if (response.ok) {
                return response;
              }

              throw new Error(response.statusText);
            })
            .then((response) => response.json())
            .then(({ counter }) => counter),
        onError: { target: 'waiting' },
        onDone: {
          target: 'done',
          actions: assign<Context, FetchedEvent>({
            counter: (_: Context, event: FetchedEvent) => event.data,
          }),
        },
      },
    },
    waiting: {
      after: { 1000: 'fetching' },
    },
    done: {
      on: {
        RESET: {
          target: 'ready',
          actions: assign<Context>({ counter: undefined }),
        },
      },
    },
  },
});

export const StateMachine: FC = () => {
  const [state, send] = useMachine(machine);

  const isPolling = ['waiting', 'fetching'].some(state.matches);

  return (
    <>
      <div>{isPolling ? 'Polling …' : state.context.counter}</div>
      {isPolling ? (
        <button type="button" onClick={() => send({ type: 'RESET' })}>
          try to reset
        </button>
      ) : null}
      <p>Current state: {state.value}</p>
      <p>Current context: {JSON.stringify(state.context)}</p>
      {state.nextEvents.includes('START_POLLING') ? (
        <button type="button" onClick={() => send({ type: 'START_POLLING' })}>
          start polling
        </button>
      ) : null}
      {state.nextEvents.includes('RESET') ? (
        <button type="button" onClick={() => send({ type: 'RESET' })}>
          reset
        </button>
      ) : null}
    </>
  );
};
