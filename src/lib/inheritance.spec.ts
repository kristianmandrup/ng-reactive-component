import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './fixtures/app.component';

describe('ReactiveComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppComponent]
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });
});
