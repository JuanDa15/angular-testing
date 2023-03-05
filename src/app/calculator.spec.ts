import { Calculator } from "./calculator";

describe('Test for calculator', () => {
  it('Multiply should return 9', () => {
    // Arrange
    const calculator = new Calculator();
    // Act
    const rta = calculator.multiply(3,3);
    // Assert
    expect(rta).toBe(9);
  });
  it('Multiply should return 0', () => {
    const calculator = new Calculator();
    const rta = calculator.multiply(3,0);
    expect(rta).toBe(0);
  });
  it('Divide should return null', () => {
    const calculator = new Calculator();
    const rta = calculator.divide(3,0);
    expect(rta).toBe(null);
  });
  it('Divide should return 0', () => {
    const calculator = new Calculator();
    const rta = calculator.divide(0,3);
    expect(rta).toBe(0);
  });
  it('Divide should return 3', () => {
    const calculator = new Calculator();
    const rta = calculator.divide(9,3);
    expect(rta).toBe(3);
  })
});
