const { faker } = require('@faker-js/faker');
const dueDatePast = {
  title: 'Title task',
  description: 'Uma descrição pra lá de boa',
  dueDate: '2024-02-20',
  creationDate: new Date().toISOString(),
}
module.exports = dueDatePast