import { faker } from "@faker-js/faker"

export function getUserRegister(
  samePasswords: boolean = false,
  acceptTerms: boolean = false
) {

  const password = faker.internet.password(6, false);

  return {
    name: faker.name.fullName({
      sex: 'male'
    }),
    email: faker.internet.email(
      faker.name.firstName(),
      faker.name.lastName(),
      faker.internet.domainName(),
      {
        allowSpecialCharacters: true
      }
    ),
    password: password,
    confirmPassword: (samePasswords) ? password : faker.internet.password(6, false),
    checkTerms: acceptTerms
  }
}

export function getName(
  sex: 'male' | 'female' = 'male'
) {
  return faker.name.fullName({sex});
}

export function getEmail(
  specialCharacter: boolean = false
) {
  return faker.internet.email(
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.domainName(),
    {
      allowSpecialCharacters: specialCharacter
    }
  )
}

export function getPassword(
  length: number  = 15,
  memorable: boolean = false,
  pattern: RegExp | undefined = undefined,
  prefix: string | undefined = undefined
) {
  return faker.internet.password(
    length,
    memorable,
    pattern,
    prefix
  );
}
