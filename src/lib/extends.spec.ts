import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ExtendedAppComponent } from './fixtures/extended.component';

describe('ReactiveComponent', () => {
  let component: ExtendedAppComponent;
  let fixture: ComponentFixture<ExtendedAppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExtendedAppComponent]
    });

    fixture = TestBed.createComponent(ExtendedAppComponent);
    component = fixture.componentInstance;
  });
});
