import {createRouter} from "../router.js";
class routerLink extends HTMLElement{
    constructor(){
        super();
    }
    get to(){
        return this.hasAttribute("to");
    }
    get replace(){
        return this.hasAttribute("replace")
    }
    connectedCallback(routes){
        if(!this.to) throw Error
        const link = document.createElement("a");
        const result = routes.find(route=>route.name==this.attributes.to.value);
        link.setAttribute("href",result.path);
        link.innerHTML=this.innerHTML;
        link.addEventListener("click",(e)=>{
            e.preventDefault();
            // if(!this.replace) router.push(this.attributes.to.value);
            // router.replace();
            
        })
        this.parentNode.insertBefore(link,this.nextSibling);
        this.remove();
    };

}
export default routerLink;