import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalysisHistoryComponent } from './analysis-history.component';

describe('AnalysisHistoryComponent', () => {
  let component: AnalysisHistoryComponent;
  let fixture: ComponentFixture<AnalysisHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnalysisHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalysisHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
