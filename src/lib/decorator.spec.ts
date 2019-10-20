import { TestBed, ComponentFixture } from '@angular/core/testing';
import { DecoratedAppComponent } from './fixtures/decorated.component';

describe('ReactiveComponent', () => {
  let component: DecoratedAppComponent;
  let fixture: ComponentFixture<DecoratedAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DecoratedAppComponent]
    });

    fixture = TestBed.createComponent(DecoratedAppComponent);
    component = fixture.componentInstance;
  });
});
