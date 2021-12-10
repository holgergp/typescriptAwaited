declare function MaybePromise<T>(value: T):  T | Promise<T> | PromiseLike<T>

declare function MaybeNumberPromise(value: number):  number | Promise<number> | PromiseLike<number>
declare type MaybePromiseType = ReturnType<typeof MaybeNumberPromise>

async function comparePromises() {
  let a: Promise<string>;
  let b: Promise<Promise<string>>;
  let c: Promise<Promise<Promise<string>>>;
  let d: Awaited<typeof c>
  // error always returns false
  // This condition will always return 'false' since the types 'Promise<string>' and 'Promise<Promise<string>>' have no overlap.ts(2367)
  a===b
  // error always returns false
  // This condition will always return 'false' since the types 'Promise<Promise<string>>' and 'Promise<Promise<Promise<string>>>' have no overlap.ts(2367)
  b===c
  const awaitA = await a
  const awaitB = await b
  const awaitC = await c
  await a === await b
  await a === await d
}

//Does not work at all!
async function doSomethingSpecial(): Awaited<[number, number]> {
    const result = await Promise.all([MaybePromise(100), MaybePromise(200)]);
    // Error!
    //
    //    [number | Promise<100>, number | Promise<200>]
    //
    // is not assignable to type
    //
    //    [number, number]
    return result;
}

//Works in 4.5 not in 4.4
async function doSomething(): Promise<[number, number]> {
    const result = await Promise.all([MaybePromise(100), MaybePromise(200)]);
    // Error!
    //
    //    [number | Promise<100>, number | Promise<200>]
    //
    // is not assignable to type
    //
    //    [number, number]
    return result;
}

//Works in 4.5 not in 4.4
async function doSomethingWithAwaited(): Promise<[number, number]> {
  //4.4 Does not know Awaited
  const result: Awaited<[number,number]> = await Promise.all([MaybePromise(100), MaybePromise(200)]);
  return result;
}

//Works in 4.5 and in 4.4
async function doSomethingWithAnyTypes(): Promise<[number, number]> {
  const promiseAllResult: Promise<[any, any]> =  Promise.all([MaybePromise(100), MaybePromise(200)]);
  const result:[any, any] = await promiseAllResult
  return result;
}

//Works in 4.5 not in 4.4
async function doSomethingWithExplicitTypesIn44(): Promise<[number, number]> {
  const promiseAllResult: Promise<[number,number]> =  Promise.all([MaybePromise(100), MaybePromise(200)]);
  const result =  await promiseAllResult
  return result;
}

//Works in 4.5 not in 4.4
async function doSomethingWithExplicitTypesIn45(): Promise<[number, number]> {
  const promiseAllResult: Promise<[Awaited<number>,Awaited<number>]> =  Promise.all([MaybePromise(100), MaybePromise(200)]);
  const anotherPromiseAllResult: Promise<[number, number]> = promiseAllResult
  //const result1:[MaybePromiseType<number>, MaybePromiseType<number>] = await promiseAllResult
  //const result2:[number, number] = await promiseAllResult
  //const result3:[Promise<number>, Promise<number>] = await promiseAllResult
  const result: Awaited<[number,number]> = await anotherPromiseAllResult
  return result;
}

//Works in 4.5 not in 4.4
async function doSomethingWithImplicitTypes(): Promise<[number, number]> {
  const promiseAllResult =  Promise.all([MaybePromise(100), MaybePromise(200)]);
  const result: Awaited<[number,number]> = await promiseAllResult
  return result;
}

//Works in 4.5 not in 4.4
async function doSomethingWithImplicitTypesAllSettled(): Promise<[PromiseFulfilledResult<number> | PromiseRejectedResult, PromiseFulfilledResult<number> | PromiseRejectedResult]> {
  const promiseAllSettledResult =  Promise.allSettled([MaybePromise(100), MaybePromise(200)]);
  /**
   * Type '[PromiseSettledResult<number | Promise<100> | PromiseLike<100>>, PromiseSettledResult<number | Promise<200> | PromiseLike<200>>]' is not assignable to type '[PromiseFulfilledResult<number> | PromiseRejectedResult, PromiseFulfilledResult<number> | PromiseRejectedResult]'.
  Type at position 0 in source is not compatible with type at position 0 in target.
    Type 'PromiseSettledResult<number | Promise<100> | PromiseLike<100>>' is not assignable to type 'PromiseFulfilledResult<number> | PromiseRejectedResult'.
      Type 'PromiseFulfilledResult<number | Promise<100> | PromiseLike<100>>' is not assignable to type 'PromiseFulfilledResult<number> | PromiseRejectedResult'.
        Type 'PromiseFulfilledResult<number | Promise<100> | PromiseLike<100>>' is not assignable to type 'PromiseFulfilledResult<number>'.
          Type 'number | Promise<100> | PromiseLike<100>' is not assignable to type 'number'.
            Type 'Promise<100>' is not assignable to type 'number'.
   * 
   */
  const result = await promiseAllSettledResult
  return result;
}


//Works in 4.5 not in 4.4
async function doSomethingWithImplicitTypesAwaitedAllSettled(): Promise<[PromiseFulfilledResult<number> | PromiseRejectedResult, PromiseFulfilledResult<number> | PromiseRejectedResult]> {
  const promiseAllSettledResult =  Promise.allSettled([MaybePromise(100), MaybePromise(200)]);
  const result: Awaited<[PromiseFulfilledResult<number> | PromiseRejectedResult, PromiseFulfilledResult<number>| PromiseRejectedResult]> = await promiseAllSettledResult
  return result;
}

async function doSomethingNonGeneric(): Promise<[number, number]> {
    const result = await Promise.all([MaybeNumberPromise(100), MaybeNumberPromise(200)]);
    // Error!
    //
    //    [number | Promise<100>, number | Promise<200>]
    //
    // is not assignable to type
    //
    //    [number, number]
    return result;
}