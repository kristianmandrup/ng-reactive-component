import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { ReactiveStateComponent } from '../decorator-mixin';

class MyBase {}

export class ExtendedAppComponent extends ReactiveStateComponent(MyBase) {
  values$ = new Subject<number>();
  state = this.connect({
    count: this.values$.pipe(
      startWith(0),
      scan((count, next) => count + next, 0)
    )
  });

  pushValue(value: number) {
    this.values$.next(value);
  }

  ngOnInit() {
    this.ngSubjectInit();
  }

  ngOnDestroy() {
    this.ngSubjectDestroy();
  }
}
