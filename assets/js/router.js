
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import useHistoryStateNavigation from "./historyNavigation.js";
import guards from "./globalGuards.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        // this.base = data.history;
        // if(!this.base) throw new Error('Provide the "history" option when calling "createRouter()":');
        this.currentRouteState= window.history.state;
            window.addEventListener("load",()=>{
                this.replace(this.currentRouteState.current)
            })
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const result = useHistoryStateNavigation.findRouteByPath(state.current);
            useHistoryStateNavigation.renderComponent(result.component);
        })
        this.currentLocation = window.location.pathname;
    }
    push(to){
        to = useHistoryStateNavigation.findRouteByPath(to);
        const from = useHistoryStateNavigation.findRouteByPath(this.currentLocation);
        useHistoryStateNavigation.push(to , from);
    };
    replace(to){
        to = useHistoryStateNavigation.findRouteByPath(to);
        useHistoryStateNavigation.replace(to);
    };
    beforeEach(handler){
        guards.beforeGuards.add(handler);
    }
    afterEach(handler){
        guards.afterGuards.add(handler);
    }
}
export function createWebHashHistory(base){
    console.log("createWebHashHistory");
    useHistoryStateNavigation.createWebHashHistory(base);
}
export function createWebHistory(base){
    console.log("createWebHistory");
    useHistoryStateNavigation.createWebHistory(base);
}