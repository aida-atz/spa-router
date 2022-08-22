
import routerLink from "./elements/routerLink.js";
import routerView from "./elements/routerView.js";
export class createRouter{
    constructor(data) {
        this.routes=data.routes;
        window.customElements.define("router-link",routerLink);
        routerLink.prototype.connectedCallback(this.routes)
        window.customElements.define("router-view",routerView);
        window.addEventListener('hashchange', ()=>{
            // this.renderComponent()
        });
        window.addEventListener('load', ()=>{
            // this.renderComponent();
        });
    }
    // parseLocation=()=>{
    //     return location.hash.slice(1)||'/';
    // };
    // findComponentByPath=(path)=>{
    //     const result=this.routes.find(route=>{
    //         return route.path.match(new RegExp(`^\\${path}$`, 'gm')) || undefined;
    //     })
    //     return result
    // };
    findComponentByName(name){
        const result = this.routes.find(route=>{
            return route.name==name ? route : undefined
        })
        return result
    }
    // renderComponent(){
    //     const {component} = this.findComponentByPath(this.parseLocation()) || {};
    //     const list = document.getElementsByTagName("router-view")[0];
    //     component().then(response=>{
    //         list.innerHTML=response.default.template;
    //     });
    // };
    push(name){
        const result = this.findComponentByName(name);
    
    };
    replace(){

    };
}
function createWebHistory(){
    console.log(window.location.hash);
    window.location.replace("/#/");
}
// const router = new createRouter({
//     routes,
//     history:""
// });
// export default router;