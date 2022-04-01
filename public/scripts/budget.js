let allCategories = [{category: 'Food', expected: 3000, spent: 1200},
{category: 'Rent', expected: 4500, spent: 4500},
{category: 'Fun Money', expected: 1000, spent: 300},
{category: 'Beer', expected: 1000, spent: 300}];

let remaining = 0;
for (let i = 0; i <allCategories.length; i++) {
  remaining += categories[i].expected - categories[i].spent;
  console.log(remaining);
}