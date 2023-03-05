import { TestBed } from '@angular/core/testing';
import { MasterService } from './master.service';
import { FakeValueService } from './value-fake.service';
import { ValueService } from './value.service';

describe('MasterService', () => {
  let masterService: MasterService;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(() => {
    // Create the spy
    const spy = jasmine.createSpyObj('ValueService', ['getValue']);

    TestBed.configureTestingModule({
      providers: [
        MasterService,
        // Assing the spy to the provider
        { provide: ValueService, useValue: spy }
      ],
    });
    masterService = TestBed.inject(MasterService);
    // Use the injected dependency in the modue
    valueServiceSpy = TestBed.inject(ValueService) as jasmine.SpyObj<ValueService>;
  })

  it('should be created', () => {
    expect(masterService).toBeTruthy();
  })

  it('should call "getValue" from valueService', () => {
    masterService.getValue()
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
  })

  describe('Diferent ways to test dependencies', () => {
      it('should return "testing value" from real service', () => {
        const valueService = new ValueService();
        const masterService = new MasterService(valueService);
        expect(masterService.getValue()).toBe('testing value')
      });
      // 1 way to test a dependency: Create a clone of the dependency, is not the better way
      it('should return "other value" from fake service', () => {
        const fakeService = new FakeValueService();
        const masterService = new MasterService(fakeService as unknown as ValueService);

        expect(masterService.getValue()).toBe('other value');
      });
      // 2 way to test a dependency: Create a object that simulate the dependency
      it('should return "other value" from the fake object', () => {
          const fakeService = {
            getValue: () => 'other value from object'
          }
          const masterService = new MasterService(fakeService as ValueService);

          expect(masterService.getValue()).toBe('other value from object');
        });
      // 3 way to test a dependency: Using spies
      it('should call getValue using spies from valueService using createSpyObj', () => {
        const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
        valueServiceSpy.getValue.and.returnValue('fake value');
        const masterService = new MasterService(valueServiceSpy);
        masterService.getValue()
        expect(valueServiceSpy.getValue).toHaveBeenCalled();
      })
  })
});
