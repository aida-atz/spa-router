import isJson from "../utilities/checkJson.js";
class routerLink extends HTMLElement{
    static router=null;
    constructor(){
        super();
    }
    get to(){
        return this.hasAttribute("to");
    }
    get replace(){
        return this.hasAttribute("replace")
    }
    connectedCallback(){
        if(!this.to) throw Error;
        const link = document.createElement("a");
        link.innerHTML=this.innerHTML;
        link.setAttribute("href",this.attributes.to.value);
        link.addEventListener("click",(e)=>{
            e.preventDefault();
            const jsonType = isJson(this.attributes.to.value);
            let to = null;
            if(!jsonType) to=this.attributes.to.value;
            else{
                const parsedResult = JSON.parse(this.attributes.to.value);
                to=parsedResult;
            }
            if(this.replace) routerLink.router.replace(to);
            else routerLink.router.push(to);
        })
        this.parentNode.insertBefore(link,this.nextSibling);
        this.remove();
    };

}
export default routerLink;