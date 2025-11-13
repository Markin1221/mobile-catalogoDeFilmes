import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Page2Page } from './page2.page';

describe('Page2Page', () => {
  let component: Page2Page;
  let fixture: ComponentFixture<Page2Page>;

  beforeEach(async () => {

    // Mock simples do Router para evitar erros
    const routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      declarations: [Page2Page],
      providers: [
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Page2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // ===== TESTES BÁSICOS =====
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default history items', () => {
    expect(component.history.length).toBeGreaterThan(0);
  });

  it('should select a history item', () => {
    const item = component.history[0];
    component.openHistoryItem(item);
    expect(component.selectedItem).toEqual(item);
  });

  it('should generate grid for selected item', () => {
    const item = component.history[0];
    component.openHistoryItem(item);

    expect(component.rows.length).toBe(item.triedWords.length);
    expect(component.cols.length).toBe(item.word.length);
  });

  it('should clear history on backspace', () => {
    component.onBackspace();
    expect(component.history.length).toBe(0);
    expect(component.selectedItem).toBeNull();
  });
});
