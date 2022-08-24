
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
import useHistoryStateNavigation from "./historyNavigation.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        const{history , location }=window;
        this.currentLocation={
            value : location.pathname
        }
        window.addEventListener("load",(event)=>{
            console.log(event);
        })
        if(!history.state){
            this.changeLocation(
                this.currentLocation.value,
                {
                    back:null,
                    current:this.currentLocation.value,
                    forward:null,
                    position:history.length-1,
                },true)
                this.renderComponent()
        }
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);

        window.addEventListener('popstate',({state})=>{
            this.renderComponent(state.currentName)
        })

    }
    renderComponent(component){
        const list = document.getElementsByTagName("router-view")[0];
        if(typeof component === "function"){
            component().then(response=>{
                list.innerHTML=response.default.template;
            });
        }else{
            const result = this.routes.find(route=>{
                return route.name == component
            })
            result.component().then(response=>{
                list.innerHTML=response.default.template
            })
        }

    };
    changeLocation(to,state , replace=false){
        window.history[replace ? "replaceState" : "pushState"](state,null,to);
    }
    push(to){
        const currentState=Object.assign({},history.state,{forward:to.path})
        this.changeLocation(currentState.current, currentState, true);
        const state = Object.assign({},{back:this.currentLocation.value,current:to.path,forward:null},{ position: currentState.position + 1},{currentName:to.name});
        this.changeLocation(to.path , state);
        this.renderComponent(to.component);
        this.currentLocation.value = to.path;
    };
    replace(to){
        this.changeLocation(to.path , true);
        this.renderComponent(to.component);
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
