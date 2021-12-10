
declare function MaybeStringPromise(value: string):  string | Promise<string> | PromiseLike<string>
declare type MaybeGenericPromiseType<T> = T | Promise<T> | PromiseLike<T>



function pipe<T>(f: (t:T)=>MaybeGenericPromiseType<T>, g: (t: MaybeGenericPromiseType<T>)=>MaybeGenericPromiseType<T> ,h: (t: MaybeGenericPromiseType<T>)=>Awaited<MaybeGenericPromiseType<T>>) {
    return async function(input: T) {
        const first = MaybePromise(input)
        const second = MaybePromise(first)
        return MaybePromise(second)
    }
}

declare function firstAsyncFn<T>(arg: MaybeGenericPromiseType<T>): MaybeGenericPromiseType<T>
declare function secondAsyncFn<T>(arg: MaybeGenericPromiseType<T>): MaybeGenericPromiseType<T>
declare function thirdAsyncFn<T>(arg: MaybeGenericPromiseType<T>): MaybeGenericPromiseType<T>

function pipedFn<T>(a: MaybeGenericPromiseType<T>) {
    return pipe(firstAsyncFn, secondAsyncFn, thirdAsyncFn);
}



// const pipedFn<T>: (a: MaybeGenericPromiseType<T>)=>MaybeGenericPromiseType<MaybePromiseType> = pipe(firstAsyncFn, secondAsyncFn, thirdAsyncFn);

const blah: string = await pipedFn(MaybeStringPromise('test'))

export{}
