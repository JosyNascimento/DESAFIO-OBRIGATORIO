const { faker } = require('@faker-js/faker');

const generateMockProduct = () => {
  return {
    _id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: parseFloat(faker.commerce.price()),
    stock: faker.number.int({ min: 0, max: 100 }), // ← atualizado aqui
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
    code: faker.string.alphanumeric(8),
    status: true,
  };
};

module.exports = generateMockProduct;
