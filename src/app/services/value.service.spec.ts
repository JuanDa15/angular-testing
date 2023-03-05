import { ValueService } from './value.service';
import { TestBed, waitForAsync } from '@angular/core/testing'

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(()=> {
    TestBed.configureTestingModule({
      providers: [
        ValueService
      ]
    });
    service = TestBed.inject(ValueService);
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Test for value(getter/setter)',  () => {
    it('Test get should be testing value', () => {
      expect(service.value).toBe('testing value')
    });
    it('Test set should update the value', () => {
      // Arrange
      const new_value = 'new testing value';
      // Act
      service.value = new_value;
      // Assert
      expect(service.value).toBe(new_value);
    })
  });
  describe('Test for getValue', () => {
    it('getValue should return "testing value"', () => {
      // Arrange
      // Act
      let value = service.getValue();
      // Assert
      expect(value).toBe('testing value');
    })
  });
  describe('Test for setValue', () => {
    it('Should update the _value variable', () => {
      let new_value = 'new testing value';
      expect(service.getValue()).toBe('testing value');
      service.setValue(new_value);
      expect(service.getValue()).toBe(new_value);
    })
  });
  describe('Test for getPromiseValue', () => {
    it('should return "testing value" from promise with then', (doneFn) => {
      service.getPromiseValue()
        .then((value) => {
          expect(value).toBe('testing value');
          doneFn()
        })
    });
    it('should return "testing value" from promise using async', async() => {
      let rta = await service.getPromiseValue()
      expect(rta).toBe('testing value')
    });
    it('should return "testing value" from promise using waitForAsync', waitForAsync(
      () => {
        service.getPromiseValue().then(val => {
          expect(val).toBe('testing value')
        })
      }
    ));
  })
});
