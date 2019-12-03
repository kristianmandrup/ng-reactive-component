import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DecoratedAppComponent } from './fixtures/decorated.component';

describe('ReactiveComponent', () => {
  //@ts-ignore
  let component: DecoratedAppComponent;
  //@ts-ignore
  let fixture: ComponentFixture<DecoratedAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratedAppComponent]
    });

    //@ts-ignore
    fixture = TestBed.createComponent(DecoratedAppComponent);
    component = fixture.componentInstance;
  });
});
