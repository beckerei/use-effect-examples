import React, { useRef, useState } from 'react';
import { Subject, merge, BehaviorSubject } from 'rxjs';
import { debounceTime, switchMap, first, skip, takeUntil } from 'rxjs/operators';
import { fromFetch } from 'rxjs/fetch';

const apiUrl =
  'https://gist.githubusercontent.com/beckerei/9efae61235a5165c9d05992c06dde402/raw/77ccc503fcc48e62d9d6aef6132610746a3b2632/fakeResponse.json';

const createStream$ = (
  triger$: BehaviorSubject<number>,
  destroy$: Subject<void>,
) =>
  merge(triger$.pipe(first()), triger$.pipe(skip(1), debounceTime(2000))).pipe(
    takeUntil(destroy$),
    switchMap(() => fromFetch(apiUrl)),
  );

export const Polling: React.FC = () => {
  const triger$ = useRef(new BehaviorSubject(0));
  const destroy$ = useRef(new Subject<void>());

  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    setIsLoading(true);
    createStream$(triger$.current, destroy$.current)
      .subscribe(async response => {
        const { status } = await response.json();
        if (status !== 200) {
          triger$.current.next(0);
        }
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
