import { NgModule } from '@angular/core';
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { ReactiveStateComponent } from '../extends';

@ReactiveStateComponent
@Component({
  selector: 'app-root',
  template: `
    <div class="count">{{ state.count }}</div>
    <div class="countLabel">Count</div>
    <button class="decrement" (click)="values$.next(-1)">
      <i class="material-icons">
        remove
      </i>
    </button>
    <button class="increment" (click)="values$.next(+1)">
      <i class="material-icons">
        add
      </i>
    </button>
  `
})
export class ExtendedAppComponent {
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

  ngOnInit() {
    //@ts-ignore
    this.ngSubjectInit();
  }

  ngOnDestroy() {
    //@ts-ignore
    this.ngSubjectDestroy();
  }
}

@NgModule({
  declarations: [ExtendedAppComponent],
  exports: [],
  providers: []
})
export class FeatureModule {}
