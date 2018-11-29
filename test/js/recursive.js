search = (n, array=[], index = Math.floor(array.length/2))=>(n<array[index])?search(n, array, Math.floor(index / 2)): (n > array[index]) ?search(n, array, Math.floor(array.length * 3 / 2)): index;

console.log(search(3, [2,1,3,5]));
