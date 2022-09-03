import instanceGuards from "./globalGuards.js";
export default class historyStateNavigation{
    constructor(routes){
        this.base="";
        this.routes=routes;
    }
    findRouteByPath(path){
        const result = this.routes.find(route=>route.path==path);
        if(!result) throw Error("route not find");
        return result;
    }
    runBeforeGuards(to,from){
        let guards = [];
        instanceGuards.beforeGuards.list().forEach(guard=>{
            guards.push(instanceGuards.guardToPromiseFn(guard, to, from));
        })
        return (instanceGuards.runGuardQueue(guards).then(()=>{
            guards=[];
            if(to.beforeEnter){
                guards.push(instanceGuards.guardToPromiseFn(to.beforeEnter,to,from))
            }
            return instanceGuards.runGuardQueue(guards);
        }))
    }
    changeLocation(to,from,state , replace=false,updateState=false){
        const url = this.base+to.path;
        if(!updateState){
            this.runBeforeGuards(to,from).then(()=>{
                window.history[replace ? "replaceState" : "pushState"](state,null,url);
                this.renderComponent(to.component);
                instanceGuards.triggerAfterEach(to , from);
            }).catch(err=>{throw err}) 
        }else{
            window.history.replaceState(state,null,url)
        }
    }
    renderComponent(component){
        const list = document.getElementsByTagName("router-view")[0];
        if(typeof component === "function"){
            component().then(response=>{
                list.innerHTML=response.default.template;
            });
        }else{
            const result = window.history.routes.find(route=>{
                return route.name == component
            })
            result.component().then(response=>{
                list.innerHTML=response.default.template
            })
        }
    }
   push(to,from){
        const currentState={
            ...history.state,
            forward:to.path,
        }
        this.changeLocation(from,from,currentState,true,true);
        const state = {
            back:currentState.current,
            current:to.path,
            forward:null,
            position: currentState.position + 1,
            currentName:to.name,
        }
        this.changeLocation(to,from , state);
    }
    replace(to ,state=null){
        this.changeLocation(to, to , state ? state : history.state , true);
    }

    /**
     * checks the base includes hash
     * @example () ---> https://example.com/#/
     * @example ("/folder/") ---> https://example.com/folder/#/
     * @example ("/folder/#/app/") ---> https://example.com/folder/#/app/
     * @example ("/folder") ---> https://example.com/#/
     * @param {string} base - It is a phrase that is added after the host
     * @return {string} - standard base
     */

    static createWebHashHistory(base){
        base = base || location.pathname;
        if(!base.includes("#")) base+="#";
        return this.createWebHistory(base)
    }
    static createWebHistory(base){
       if(!base){
           base="/"
       }
        base = base.replace(/\/$/ , "");
        this.base=base;
    }
}
// const useHistoryStateNavigation = new historyStateNavigation();
// export default useHistoryStateNavigation;