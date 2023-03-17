import { faker } from "@faker-js/faker"
import { User } from "./user.model";

export function getUserRegister(
  samePasswords: boolean = false,
  acceptTerms: boolean = false
) {

  let password = faker.internet.password(6, false);
  password = password+1;
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
    checkTerms: acceptTerms,
    avatar: faker.internet.avatar()
  }
}

export function getRegisterResponse(
  role: 'admin' | 'customer'
): User {
  return {
    name: getName('male'),
    email: getEmail(true),
    avatar: faker.internet.avatar(),
    password: getPassword(8, false),
    role: role,
    id: faker.datatype.uuid()
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
  valid: boolean = true,
  memorable: boolean = false,
  pattern: RegExp | undefined = undefined,
  prefix: string | undefined = undefined
) {
  const password = faker.internet.password(
    length,
    memorable,
    pattern,
    prefix
  );
  return valid ? password+1 : 'fsefsefese';
}
