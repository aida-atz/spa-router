
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        this.historyState = { value: history.state };
        window.router=this;
        window.customElements.define("router-link",routerLink);
        window.customElements.define("router-view",routerView);
        window.addEventListener('popstate',({state})=>{
            const to=location.pathName;
            const from = state.back;
            console.log(history)
            console.log(state)
        })
    }
    renderComponent(component){
        const list = document.getElementsByTagName("router-view")[0];
        component().then(response=>{
            list.innerHTML=response.default.template;
        });
    };
    changeLocation(to,state , replace=false){
        window.history[replace ? "replaceState" : "pushState"](state,null,to);
    }
    push(to){
        const currentState=Object.assign({},this.historyState,history.state,{forward:to})
        const state = Object.assign({},{back:location.pathname,current:to.path,forward:null},{position:currentState.position? currentState.position+1 :1})
        this.changeLocation(to.path , state)
        this.renderComponent(to.component);
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
    addRoute(){

    };
    removeRoute(){

    }
}
function createWebHistory(){
    console.log(window.location.hash);
    window.location.replace("/#/");
}
