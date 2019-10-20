// See: https://www.logicbig.com/tutorials/misc/typescript/class-decorators.html
import { OnInit, OnDestroy, ɵmarkDirty as markDirty } from '@angular/core';
import { Observable, from, ReplaySubject, concat } from 'rxjs';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';

type ObservableDictionary<T> = {
  [P in keyof T]: Observable<T[P]>;
};

const OnInitSubject = Symbol('OnInitSubject');
const OnDestroySubject = Symbol('OnDestroySubject');

export interface ReactiveState {
  connect<T>(sources: ObservableDictionary<T>): T;
  ngSubjectInit(): void;
  ngSubjectDestroy(): void;
}

// using extended constructor approach
export function ReactiveStateComponent<C extends { new (...args: any[]): {} }>(
  constructor: C
) {
  return class extends constructor implements ReactiveState {
    [OnInitSubject] = new ReplaySubject<true>(1);
    [OnDestroySubject] = new ReplaySubject<true>(1);

    public get onInit$(): Observable<true> {
      return this[OnInitSubject].asObservable();
    }

    public get onDestroy$(): Observable<true> {
      return this[OnDestroySubject].asObservable();
    }

    connect<T>(sources: ObservableDictionary<T>): T {
      const sink = {} as T;
      const sourceKeys = Object.keys(sources) as (keyof T)[];
      const updateSink$ = from(sourceKeys).pipe(
        mergeMap(sourceKey => {
          const source$ = sources[sourceKey];

          return source$.pipe(
            tap((sinkValue: any) => {
              sink[sourceKey] = sinkValue;
            })
          );
        })
      );

      concat(this.onInit$, updateSink$)
        .pipe(takeUntil(this.onDestroy$))
        .subscribe(() => markDirty(this));

      return sink;
    }

    ngSubjectInit() {
      this[OnInitSubject].next(true);
      this[OnInitSubject].complete();
    }

    ngSubjectDestroy() {
      this[OnDestroySubject].next(true);
      this[OnDestroySubject].complete();
    }
  };
}
