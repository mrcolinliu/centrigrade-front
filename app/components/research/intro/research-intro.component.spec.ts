import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResearchIntroComponent } from './research-intro.component';

describe('ResearchIntroComponent', () => {
  let component: ResearchIntroComponent;
  let fixture: ComponentFixture<ResearchIntroComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [ResearchIntroComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ResearchIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
