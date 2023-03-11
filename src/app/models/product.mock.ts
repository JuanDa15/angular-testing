import { Product } from "./product.model";
import { faker } from "@faker-js/faker"
export function generateOneProduct(): Product {
  return  {
    id: faker.datatype.uuid(),
    category: {
      id: faker.datatype.number({min: 0, max: 100}),
      name: faker.commerce.department()
    },
    description: faker.commerce.productDescription(),
    images: generateImagesArr(3),
    price: parseInt(faker.commerce.price()),
    title: faker.commerce.productName()
  };
}

export function generateManyProducts(length: number = 10): Product[] {
  return new Array<Product>(length).fill(generateOneProduct());
}

function generateImagesArr(length: number = 1) {
  const temp = new Array(length).fill(faker.image.imageUrl);
  return temp;
}
