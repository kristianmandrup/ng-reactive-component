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

export class $ReactiveStateComponent {
  public OnInitSubject = new ReplaySubject<true>(1);
  public OnDestroySubject = new ReplaySubject<true>(1);

  public get onInit$(): Observable<true> {
    return this.OnInitSubject.asObservable();
  }

  public get onDestroy$(): Observable<true> {
    return this.OnDestroySubject.asObservable();
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
    this.OnInitSubject.next(true);
    this.OnInitSubject.complete();
  }

  ngSubjectDestroy() {
    this.OnDestroySubject.next(true);
    this.OnDestroySubject.complete();
  }
}

type Constructor<T = {}> = new (...args: any[]) => T;
export function ReactiveStateComponent<TBase extends Constructor>(Base: TBase) {
  return class extends $ReactiveStateComponent {};
}
