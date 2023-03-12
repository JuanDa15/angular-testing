export class Person {

  constructor(
    public name:string,
    public lastname: string,
    public age: number,
    public weigth: number,
    public heigth: number
  ){

  }

  calcIMC(): string {
    const imc = Math.round(this.weigth / (Math.pow(this.heigth, 2)));
    // 0 - 18 = down
    // 19 - 24 = normal
    // 25 - 26 = overweigth
    // 27 - 29 = overweigth level 1
    // 30 - 39 = overweigth level 2
    // 40 = overweigth level 3

    if (imc >= 40) {
      return  'overweigth level 3';
    }
    else if (imc >= 30) {
      return 'overweigth level 2';
    }
    else if (imc >= 27) {
      return 'overweigth level 1';
    }
    else if (imc >= 25) {
      return 'overweigth';
    }
    else if (imc >= 18) {
      return 'normal';
    }
    else if (imc >= 0) {
      return 'down';
    }
    else{
      return 'not found'
    }
  }
}
