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
        const result = window.router.routes.find(route=>route.name==this.attributes.to.value);
        if(!result) throw Error("route not find")
        link.setAttribute("href",result.path);
        link.addEventListener("click",(e)=>{
            e.preventDefault();
            if(this.replace){
                window.router.replace(result);
            }else{
                window.router.push(result);
            }
        })
        this.parentNode.insertBefore(link,this.nextSibling);
        this.remove();
    };

}
export default routerLink;