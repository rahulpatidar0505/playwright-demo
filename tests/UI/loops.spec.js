import { test, expect } from '@playwright/test';

test('Loops', async ({ page }) => {
  //   for (let i = 0; i < 5; i++) {
  //     if (i === 3) {
  //       console.log('Breaking the loop at i = 3');
  //       console.log(i);
  //       break;
  //     }
  //   }

  const myArray = ['apple', 'banana', 'cherry'];
  //   for (let i = 0; i < myArray.length; i++) {
  //     console.log(myArray[i]);
  //   }

  for (const element of myArray) {
    console.log(element);
  }

  myArray.forEach(abc => {
    console.log(abc);
  });
});
