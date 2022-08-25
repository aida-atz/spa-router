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
        const result = useHistoryStateNavigation.findRoute(this.attributes.to.value);
        link.setAttribute("href",result.path);
        link.addEventListener("click",(e)=>{
            e.preventDefault();
            if(this.replace){
                useHistoryStateNavigation.replace(result);
            }else{
                useHistoryStateNavigation.push(result);
            }
        })
        this.parentNode.insertBefore(link,this.nextSibling);
        this.remove();
    };

}
export default routerLink;