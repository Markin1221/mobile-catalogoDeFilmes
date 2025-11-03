import { TestBed } from '@angular/core/testing';

import { ReceitasApi } from './receitas-api';

describe('ReceitasApi', () => {
  let service: ReceitasApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReceitasApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
