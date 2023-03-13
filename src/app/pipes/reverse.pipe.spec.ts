import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let pipe: ReversePipe;
  beforeEach(() => {
    pipe = new ReversePipe();
  })
  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });
  it('should transform "roma" to "amor"', () => {
    expect(pipe.transform('roma')).toBe('amor');
  })
});
