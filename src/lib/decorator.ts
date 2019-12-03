import { OnInit, OnDestroy, ɵmarkDirty as markDirty } from '@angular/core';
import { Observable, from, ReplaySubject, concat } from 'rxjs';
import { mergeMap, tap, takeUntil } from 'rxjs/operators';

export interface ReactiveState extends OnInit, OnDestroy {
  connect<T>(sources: ObservableDictionary<T>): T;
  onInit$(): Observable<true>;
  onDestroy$(): Observable<true>;
  ngSubjectInit(): void;
  ngSubjectDestroy(): void;
}

type ObservableDictionary<T> = {
  [P in keyof T]: Observable<T[P]>;
};

const OnInitSubject = Symbol('OnInitSubject');
const OnDestroySubject = Symbol('OnDestroySubject');

const onInit$ = (ctx: any) => (): Observable<true> => {
  return ctx[OnInitSubject].asObservable();
};

const onDestroy$ = (ctx: any) => (): Observable<true> => {
  return ctx[OnDestroySubject].asObservable();
};

const connect = (ctx: any) => <T>(sources: ObservableDictionary<T>): T => {
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

  concat(ctx.onInit$(), updateSink$)
    .pipe(takeUntil(ctx.onDestroy$()))
    .subscribe(() => markDirty(this));

  return sink;
};

const ngSubjectInit = (ctx: any) => (): void => {
  ctx = ctx || this;
  ctx[OnInitSubject].next(true);
  ctx[OnInitSubject].complete();
};

const ngSubjectDestroy = (ctx: any) => (): void => {
  ctx = ctx || this;
  ctx[OnDestroySubject].next(true);
  ctx[OnDestroySubject].complete();
};

const fnMap = {
  connect,
  ngSubjectInit,
  ngSubjectDestroy
};

const getterMap = {
  onInit$,
  onDestroy$
};

// function extend(destination, source) {
//   for (let k in source) {
//     if (source.hasOwnProperty(k)) {
//       destination[k] = source[k];
//     }
//   }
//   return destination;
// }

// See: https://javascriptweblog.wordpress.com/2011/05/31/a-fresh-look-at-javascript-mixins/
const asReactive = function(): ReactiveState {
  Object.keys(fnMap).map(key => {
    this[key] = fnMap[key](this);
  });

  Object.keys(getterMap).map(key => {
    Object.defineProperty(this, key, {
      get: getterMap[key](this)
    });
  });

  this[OnInitSubject] = new ReplaySubject<true>(1);
  this[OnDestroySubject] = new ReplaySubject<true>(1);

  this.prototype.ngOnInit = () => {
    //@ts-ignore
    this.ngSubjectInit();
  };

  this.prototype.ngOnDestroy = () => {
    //@ts-ignore
    this.ngSubjectDestroy();
  };
  return this;
};

export function ReactiveStateComponent<T>(
  constructorFn: Function
): ReactiveState & T {
  return asReactive.call(constructorFn.prototype);
}
