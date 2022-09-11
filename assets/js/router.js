
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import historyStateNavigation from "./historyNavigation.js";
import guards from "./globalGuards.js";
export class createRouter{
    #historyNavigationInstance;
    constructor(data) {
        this.routes=data.routes;
        this.currentRouteState= window.history.state;
        this.#historyNavigationInstance=new historyStateNavigation(this.routes);
        console.log(`${location.pathname}${location.search}`);
        if(!this.currentRouteState){
            console.log(location);
            this.replace(`${location.pathname}${location.search}`,{
                back:null,
                current:`${location.pathname}${location.search}`,
                currentName:null,
                forward:null,
                position:window.history.length-1,
            })
        }
        window.addEventListener("load",()=>{

            this.replace(this.currentRouteState.current)
        });
        routerLink.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const result = this.#historyNavigationInstance.findRoute(state.current);
            this.#historyNavigationInstance.renderComponent(result.component);
        })
    }
    push(to){
        to = this.#historyNavigationInstance.findRoute(to);
        const from = this.#historyNavigationInstance.findRoute(this.currentRouteState.current);
        this.#historyNavigationInstance.push(to , from);
    };
    replace(to , state=null){
        to = this.#historyNavigationInstance.findRoute(to);
        this.#historyNavigationInstance.replace(to,state);
    };
    beforeEach(handler){
        guards.beforeGuards.add(handler);
    }
    afterEach(handler){
        guards.afterGuards.add(handler);
    }
}
export function createWebHashHistory(base){
    historyStateNavigation.createWebHashHistory(base);
}
export function createWebHistory(base){
    historyStateNavigation.createWebHistory(base);
}