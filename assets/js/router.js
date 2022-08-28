
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import useHistoryStateNavigation from "./historyNavigation.js";
import guards from "./globalGuards.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        this.currentRouteState= window.history.state;
            window.addEventListener("load",()=>{
                console.log(this.currentRouteState.current);
                this.replace(this.currentRouteState.current)
            })
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const result = useHistoryStateNavigation.findRoute(state.currentName);
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
function createWebHistory(){
    console.log(window.location.hash);
    window.location.replace("/#/");
}
