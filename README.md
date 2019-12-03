# ng-reactive-component

Angular Reactive Component as proposed by [@mikeryandev](https://twitter.com/mikeryandev) in his talk [Building with Ivy: rethinking reactive Angular](https://www.youtube.com/watch?v=rz-rcaGXhGk) at AngularConnect 2019.

See original repo with demo for presentation [here](https://github.com/MikeRyanDev/rethinking-reactivity-angularconnect2019)

## Demo

[Demo app under development](https://github.com/kristianmandrup/ng-reactive-component-demo)

## Install

`$ npm i ng-reactive-component`

## Usage example

The following approaches can be used to enhance a component with reactive state behavior

- inheriting from `ReactiveComponent`
- adding class decorator `@ReactiveStateComponent`

The decorator is the most flexible approach (recommended)

### Inheritance

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

### Decorator

Note that currently the typing for the decorator is "messed up". Not sure how to properly implement class decorators in typescript so that the typing for the decoration/extension is picked up.

I've currently tried two approaches

```ts
import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { scan, startWith } from 'rxjs/operators';
import { ReactiveStateComponent, ReactiveState } from 'ng-reactive-component';

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
export class DecoratedAppComponent implements ReactiveState {
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
    this[OnInitSubject].complete();
  }

  ngOnDestroy() {
    this.ngSubjectDestroy();
  }
}
```

## Decorator fix

As per [stackoverflow solution suggestion](https://stackoverflow.com/questions/54892401/extending-type-when-extending-an-es6-class-with-a-typescript-decorator/55520697#55520697)

```ts
class Base {
  tableName = 'My table name';
  hello(name) {
    return `hello ${name}`;
  }
}

type Constructor<T = {}> = new (...args: any[]) => T;
function UserFields<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    name: string;
    email: string;
  };
}

class User extends UserFields(Base) {}
const u = new User();
u.tableName = 'users'; // ok
u.name = 'John'; // ok
```

You can see this pattern in action in `decorator-mixin.component.ts` under [lib/fixtures](./src/lib/fixtures)

## Development

This library was built using [typescript-starter](https://github.com/bitjson/typescript-starter)

### Testing

The project is currently configured to use [ava](https://avajs.dev) for testing (as per the `package.json` config).
[Jest](jestjs.io) has also been addeed and is used in the spec under development.

An Angular Component test has been started but needs to be fleshed out. Please add whatever testing framework and approach most suitable.

### Contributing

Please help make this a great library. I (Kristian Mandrup) have only just started my initiation and journey with Angular coming from a React, Vue and NodeJs background. Please help out :)

Cheers!
