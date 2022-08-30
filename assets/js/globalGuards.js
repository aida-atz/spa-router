import useHistoryStateNavigation from "./historyNavigation.js"
class guards{
    constructor(){
        this.beforeGuards = this.useCallbacks();
        this.afterGuards = this.useCallbacks();
    };
    useCallbacks() {
        let handlers = [];
        function add(handler) {
            handlers.push(handler);
        }
        return {
            add,
            list: () => handlers,
        };
    };
    runGuardQueue(guards) {
        return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
    }
    guardToPromiseFn(guard, to, from) {
        return () => new Promise((resolve, reject) => {
            const next = (valid) => {
                if (valid === false){
                    reject(new Error(`Navigation aborted from "${from.path}" to "${to.path}" via a navigation guard.`));
                }
                else if (valid instanceof Error) {
                    reject(valid);
                }
                else if (typeof valid == "object") {
                    const route = useHistoryStateNavigation.findRouteByPath(valid.path);
                    useHistoryStateNavigation.push( route , from);
                    reject(new Error`Redirected from "${from.path}" to "${route.path}" via a navigation guard.`);
                }
                else {
                    resolve();
                }
            };
            const guardReturn = guard(to , from);
            let guardCall = Promise.resolve(guardReturn);
            guardCall = guardCall.then(next);
            guardCall.catch(err => reject(err));
        });
    }
    triggerAfterEach(to, from) {
        for (const guard of this.afterGuards.list())
            guard(to, from);
    }
}
const instanceGuards = new guards;
export default instanceGuards;