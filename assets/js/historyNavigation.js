import instanceGuards from "./globalGuards.js";
class historyStateNavigation{
    constructor(){
        const{history , location }=window;
        this.base="";
        this.currentLocation={
            value : location.pathname
        }
        if(!history.state){
            this.changeLocation(
                this.currentLocation.value,
                {
                    back:null,
                    current:this.currentLocation.value,
                    // currentName:this.findRouteByPath(this.currentLocation.value),
                    forward:null,
                    position:history.length-1,
                },true)
            this.renderComponent()
        }
    }
    findRouteByPath(path){
        console.log(path);
        const result = window.router.routes.find(route=>route.path==path);
        console.log(result);
        if(!result) throw Error("route not find");
        return result;
    }
    navigate(to,from){
        let guards = [];
        instanceGuards.beforeGuards.list().forEach(guard=>{
            guards.push(instanceGuards.guardToPromiseFn(guard, to, from));
        })
        return (instanceGuards.runGuardQueue(guards).then(()=>{
            guards=[];
            if(to.beforeEnter){
                guards.push(instanceGuards.guardToPromiseFn(to.beforeEnter,to,from))
            }
            return instanceGuards.runGuardQueue(guards);
        }))
    }
    changeLocation(to,state , replace=false){
        const currentLocation = {
            value: this.createCurrentLocation(),
        };
        const hashIndex = this.base.indexOf('#');
        const url = hashIndex > -1
            ? (window.location.host && document.querySelector('base')
                ? this.base
                : this.base.slice(hashIndex)) + to
            : window.location.protocol + '//' + window.location.host + this.base + to;
            // console.log(url , to.path);
        window.history[replace ? "replaceState" : "pushState"](state,null,url)
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
    }
    push(to,from){
        this.navigate(to,from).then(()=>{
            const currentState=Object.assign({},history.state,{forward:to.path});
            console.log(from , currentState);
            this.replace(from, currentState);
            const state = Object.assign({},{back:this.currentLocation.value,current:to.path,forward:null},{ position: currentState.position + 1},{currentName:to.name});
            console.log(state);
            this.changeLocation(to.path , state);
            instanceGuards.triggerAfterEach(to , from);
            this.renderComponent(to.component);
            this.currentLocation.value = to.path;
        }).catch(err=>{
            throw err
        })

    }
    replace(to ,state=null){
        this.changeLocation(to.path , state ? state : history.state , true);
        this.renderComponent(to.component);
    }
    createWebHashHistory(base){
        base = location.host ? base || location.pathname : "";
        if(!base.includes("#")) base+="#";
        return this.createWebHistory(base)
    }
    createWebHistory(base){
       if(!base){
           base="/"
       }
        base = base.replace(/\/$/ , ""); //آخرین اسلش را حذف می کند 
       
  
        this.base=base;
        console.log(this.base);
    }
    createCurrentLocation(){
        const hashPos = this.base.indexOf('#');
        if (hashPos > -1) {
            let slicePos = window.location.hash.includes(this.base.slice(hashPos))
                ? this.base.slice(hashPos).length
                : 1;
            let pathFromHash = window.location.hash.slice(slicePos);
            // prepend the starting slash to hash so the url starts with /#
            if (pathFromHash[0] !== '/')
                pathFromHash = '/' + pathFromHash;
            return this.stripBase(pathFromHash, '');
        }
        const path = this.stripBase(window.location.pathname, this.base);
        return path  + window.location.hash;
    }
    stripBase(pathname, base) {
        // no base or base is not found at the beginning
        if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
            return pathname;
        return pathname.slice(base.length) || '/';
    }
}
const useHistoryStateNavigation = new historyStateNavigation();
export default useHistoryStateNavigation;