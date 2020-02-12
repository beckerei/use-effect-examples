import React, { useRef, useState } from 'react';
import { Subject, merge, BehaviorSubject } from 'rxjs';
import {
  debounceTime,
  switchMap,
  first,
  skip,
  takeUntil,
  filter,
  tap,
} from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

const apiUrl = 'http://localhost:8080/polling';

const poll$ = (
  triger$: BehaviorSubject<number>,
  destroy$: Subject<void>,
) =>
  merge(triger$.pipe(first()), triger$.pipe(skip(1), debounceTime(2000))).pipe(
    takeUntil(destroy$),
    switchMap(() => fromFetch(apiUrl)),
    tap(response => !response.ok && triger$.next(0)),
    filter(response => response.ok),
  );

export const Polling: React.FC = () => {
  const triger$ = useRef(new BehaviorSubject(0));
  const destroy$ = useRef(new Subject<void>());
  const [data, setData] = useState();

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    triger$.current.subscribe(() => setIsLoading(true));
    destroy$.current.subscribe(() => {
      setIsLoading(false);
      setData(undefined);
    });

    poll$(triger$.current, destroy$.current).subscribe(
      async response => {
        const body = await response.json();
        setData(body.counter);
        setIsLoading(false);
      },
    );

    return () => {
      destroy$.current.next();
      destroy$.current.unsubscribe();
      triger$.current.unsubscribe();
    };
  }, []);

  return (
    <>
      <div>{isLoading ? 'Polling …' : data}</div>
      <button
        onClick={() => {
          triger$.current.next(0);
        }}
      >
        Force fetch
      </button>
      <button
        onClick={() => {
          destroy$.current.next();
        }}
      >
        Abort
      </button>
    </>
  );
};
