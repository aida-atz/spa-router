
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import useHistoryStateNavigation from "./historyNavigation.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        this.currentRouteState= window.history.state;
            window.addEventListener("load",()=>{
                this.replace({name:this.currentRouteState.currentName})
            })
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const result = useHistoryStateNavigation.findRoute(state.currentName);
            useHistoryStateNavigation.renderComponent(result.component);
        })
    }
    push({name}){
        const result = useHistoryStateNavigation.findRoute(name);
        useHistoryStateNavigation.push(result);
    };
    replace({name}){
        const result = useHistoryStateNavigation.findRoute(name);
        useHistoryStateNavigation.replace(result);
    };
    next(){
        
    };
    previous(){
        
    };
    beforeEach(){

    };
}
function createWebHistory(){
    console.log(window.location.hash);
    window.location.replace("/#/");
}
