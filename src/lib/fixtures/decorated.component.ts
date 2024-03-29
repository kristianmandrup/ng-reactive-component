import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { ReactiveStateComponent, IReactiveState } from '../decorator';

@Component({
  selector: 'app-root'
})
class AppComponent {
  values$ = new Subject<number>();
  //@ts-ignore
  state = this.connect({
    count: this.values$.pipe(
      startWith(0),
      scan((count, next) => count + next, 0)
    )
  });

  pushValue(value: number) {
    this.values$.next(value);
  }
}

export const DecoratedAppComponent = ReactiveStateComponent(AppComponent);
