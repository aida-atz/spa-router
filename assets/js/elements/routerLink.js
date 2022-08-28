import useHistoryStateNavigation from "../historyNavigation.js"
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
    connectedCallback(){
        if(!this.to) throw Error;
        const link = document.createElement("a");
        link.innerHTML=this.innerHTML;
        link.setAttribute("href",this.attributes.to.value);
        link.addEventListener("click",(e)=>{
            e.preventDefault();
            if(this.replace){
                window.router.replace(this.attributes.to.value)
            }else{
                window.router.push(this.attributes.to.value)
            }
        })
        this.parentNode.insertBefore(link,this.nextSibling);
        this.remove();
    };

}
export default routerLink;