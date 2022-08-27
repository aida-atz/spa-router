class globalGuards{
    constructor(){
        this.beforeGuards = this.useCallbacks();
        this.afterGuards = this.useCallbacks();
        this.pendingLocation = {
            path: '/',
            name: undefined,
            params: {},
            query: {},
            hash: '',
            fullPath: '/',
            matched: [],
            meta: {},
            redirectedFrom: undefined,
        };
    };
    useCallbacks() {
        let handlers = [];
        function add(handler) {
            handlers.push(handler);
            return () => {
                const i = handlers.indexOf(handler);
                if (i > -1)
                    handlers.splice(i, 1);
            };
        }
        return {
            add,
            list: () => handlers,
        };
    };
    // canOnlyBeCalledOnce(next, to, from) {
    //     let called = 0;
    //     return function () {
    //         if (called++ === 1)
    //         throw new Error(`The "next" callback was called more than once in one navigation guard when going from "${from.path}" to "${to.path}". It should be called exactly one time in each navigation guard. This will fail in production.`)
    //         // @ts-expect-error: we put it in the original one because it's easier to check
    //         next._called = true;
    //         if (called === 1)
    //             next.apply(null, arguments);
    //     };
    // }
    checkCanceledNavigation(to, from) {
        if (this.pendingLocation !== to) {
            return new Error(`Navigation cancelled from "${from.path}" to "${to.path}" with a new navigation.`)
        }
    }
    checkCanceledNavigationAndReject(to, from) {
        const error = this.checkCanceledNavigation(to, from);
        return error ? Promise.reject(error) : Promise.resolve();
    }
    runGuardQueue(guards) {
        return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
    }
    guardToPromiseFn(guard, to, from) {
        return () => new Promise((resolve, reject) => {
            const next = (valid) => {
                if (valid === false){
                    console.log("valid = false");
                    reject(new Error(`Navigation aborted from "${from.path}" to "${to.path}" via a navigation guard.`));
                }
                else if (valid instanceof Error) {
                    reject(valid);
                }
                else if (typeof valid == "object") {
                    reject(new Error`Redirected from "${from.path}" to "${to.path}" via a navigation guard.`);
                }
                else {
                    console.log("resolve");
                    resolve();
                }
            };
            const guardReturn = guard(to , from);
            let guardCall = Promise.resolve(guardReturn);
            guardCall = guardCall.then(next);
            guardCall.catch(err => reject(err));
        });
    }
}
const guards = new globalGuards;
export default guards;