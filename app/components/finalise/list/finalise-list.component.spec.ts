import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinaliseListComponent } from './finalise-list.component';

describe('FinaliseListComponent', () => {
  let component: FinaliseListComponent;
  let fixture: ComponentFixture<FinaliseListComponent>;

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [FinaliseListComponent]
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(FinaliseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
