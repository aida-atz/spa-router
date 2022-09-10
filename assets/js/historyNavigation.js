import instanceGuards from "./globalGuards.js";
export default class historyStateNavigation{
    constructor(routes){
        this.base="";
        this.routes=routes;
    }
    findRoute(to){
        let route = null;
        if(typeof to=="string"){
            route=this.findRouteByPath(to)
        }else if(typeof to =="object"){
            if(to.name){
                route=this.findRouteByName(to);
            }
        }
        return route;
    }
    findRouteByPath(to){
        const routeParams={};
        const pathSegments = to.split("/").slice(1);
        const result = this.routes.find(route=>{
            const routePathSegments = route.path.split("/").slice(1);
            if(routePathSegments.length!==pathSegments.length) return false;
            const match = routePathSegments.every((routePathSegment, i) => {
                return routePathSegment === pathSegments[i] || routePathSegment[0] === ':';
            });
            if(match){
                routePathSegments.forEach((segment, i) => {
                    if (segment[0] === ':') {
                        const propName = segment.slice(1);
                        routeParams[propName] = decodeURIComponent(pathSegments[i]);
                    }
                });
            }
            return match;
        })
        if(!result) throw Error("route not find");
        let startQuery = to.split("?").slice(1);
        startQuery=startQuery[0].replace(/=/g,":").replace(/&/g,",").split(",");
        console.log(startQuery);
        console.log({...startQuery});
        console.log(JSON.parse({startQuery}));
        const route = {path:to , params:{...routeParams} , component:result.component , name:result.name};
        return route;
    }
    findRouteByName(to){
        let routeParams={};
        let routeQuerys={};
        let path = "";
       const result = this.routes.find(route=>{
            if(to.name==route.name){
                const routePathSegments = route.path.split("/").slice(1);
                routePathSegments.forEach((segment, i) => {
                    if (segment[0] === ':') {
                        const propName = segment.slice(1);
                        if(!to.params || !to.params[propName]) throw Error("param nadare");
                        routeParams[propName]=to.params[propName];
                        path=path.concat(`/${to.params[propName]}`);
                    }
                    else{
                        path=path.concat(`/${segment}`);
                    }
                });
                if(to.query) {
                    routeQuerys=to.query;
                    Object.keys(routeQuerys).forEach((query , index)=>{
                        if(index==0) path=path.concat(`?${query}=${routeQuerys[query]}`);
                        else path=path.concat(`&${query}=${routeQuerys[query]}`);
                    })
                }
                return route;
            }
       })
       const route = {path , params:{...routeParams} , component:result.component , name:result.name , query:{...routeQuerys}};
       return route;
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
            window.history.replaceState(state,null,url);
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