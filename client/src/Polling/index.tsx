import React, { useRef, useState } from 'react';
import { Subject, merge, BehaviorSubject, empty } from 'rxjs';
import {
  debounceTime,
  switchMap,
  first,
  skip,
  takeUntil,
  map,
  filter,
  tap,
} from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

const apiUrl = 'http://localhost:8080/polling';

const createStream$ = (
  triger$: BehaviorSubject<number>,
  destroy$: Subject<void>,
) =>
  merge(triger$.pipe(first()), triger$.pipe(skip(1), debounceTime(2000))).pipe(
    takeUntil(destroy$),
    switchMap(() => fromFetch(apiUrl)),
    tap(response => !response.ok && triger$.next(0)),
    filter(response => response.ok),
    map(response => response.json()),
  );

export const Polling: React.FC = () => {
  const triger$ = useRef(new BehaviorSubject(0));
  const destroy$ = useRef(new Subject<void>());

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    createStream$(triger$.current, destroy$.current)
      .subscribe(body => {
        console.log('Response: ', body);
      })
      .add(() => setIsLoading(false));

    return () => {
      destroy$.current.next();
      destroy$.current.unsubscribe();
    };
  }, []);

  return (
    <>
      <div>{isLoading ? 'Polling …' : 'Done'}</div>
      <button
        onClick={() => {
          triger$.current.next(0);
        }}
      >
        Force fetch
      </button>
      <button
        onClick={() => {
          triger$.current.complete();
        }}
      >
        Abort
      </button>
    </>
  );
};
