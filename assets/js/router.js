
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import useHistoryStateNavigation from "./historyNavigation.js";
import guards from "./globalGuards.js";
export class createRouter{
    constructor(data) {
        window.router=this;
        this.routes=data.routes;
        this.currentRouteState= window.history.state;
        if(!this.currentRouteState){
            this.replace(location.pathname,{
                back:null,
                current:location.pathname,
                currentName:null,
                forward:null,
                position:window.history.length-1,
            })
        }
        window.addEventListener("load",()=>{
            this.replace(this.currentRouteState.current)
        })
    
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const result = useHistoryStateNavigation.findRouteByPath(state.current);
            useHistoryStateNavigation.renderComponent(result.component);
        })
    }
    push(to){
        to = useHistoryStateNavigation.findRouteByPath(to);
        const from = useHistoryStateNavigation.findRouteByPath(this.currentRouteState.current);
        useHistoryStateNavigation.push(to , from);
    };
    replace(to , state=null){
        to = useHistoryStateNavigation.findRouteByPath(to);
        useHistoryStateNavigation.replace(to,state);
    };
    beforeEach(handler){
        guards.beforeGuards.add(handler);
    }
    afterEach(handler){
        guards.afterGuards.add(handler);
    }
}
export function createWebHashHistory(base){
    useHistoryStateNavigation.createWebHashHistory(base);
}
export function createWebHistory(base){
    useHistoryStateNavigation.createWebHistory(base);
}