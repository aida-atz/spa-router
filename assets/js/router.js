
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('hashchange', ()=>{
        
        });
        window.addEventListener('load', ()=>{
        
        });
    }
    renderComponent(component){
        const list = document.getElementsByTagName("router-view")[0];
        component().then(response=>{
            list.innerHTML=response.default.template;
        });
    };
    changeLocation(to , replace=false){
        window.history[replace ? "replaceState" : "pushState"](null,null,to);
    }
    push(route){
        this.changeLocation(route.path)
        this.renderComponent(route.component);
    };
    replace(route){
        this.changeLocation(route.path , true);
        this.renderComponent(route.component);
    };
    next(){
        
    };
    previous(){
        
    };
    beforeEach(){

    };
    addRoute(){

    };
    removeRoute(){

    }
}
function createWebHistory(){
    console.log(window.location.hash);
    window.location.replace("/#/");
}
