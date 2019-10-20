# ng-reactive-component

Angular Reactive Component as proposed by [@mikeryandev](https://twitter.com/mikeryandev) in his talk [Building with Ivy: rethinking reactive Angular](https://www.youtube.com/watch?v=rz-rcaGXhGk) at AngularConnect 2019.

See original repo with demo for presentation [here](https://github.com/MikeRyanDev/rethinking-reactivity-angularconnect2019)

## Install

`$ npm i ng-reactive-component`

## Usage example

```ts
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { ReactiveComponent } from 'ng-reactive-component';

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
export class AppComponent extends ReactiveComponent {
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
}
```

## Development

This library was built using [typescript-starter](https://github.com/bitjson/typescript-starter)
