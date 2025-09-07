const arr = [
  { value: 1 },
  { value: 2 },
  5,
  6,
  7,
  'test',
  'test2',
  'test3',
  'test4',
  false,
  null,
  undefined,
  [123],
  [456],
  new Date("2021-06-22"),
  new Date("2022-02-01")
];

function sortByType(array) {
  const id = {};

  for (const item of array) {
    let type;

    if (item === null) {
      type = 'null';
    } else if (item instanceof Date) {
      type = 'date';
    } else if (Array.isArray(item)) {
      type = 'array';
    } else {
      type = typeof item;
    }

    if (!id[type]) {
      id[type] = [];
    }

    id[type].push(item);
  }

  return id;
}

const result = sortByType(arr);
console.log(result);