import guards from "./globalGuards.js";
class historyStateNavigation{
    constructor(){
        const{history , location }=window;
        this.currentLocation={
            value : location.pathname
        }
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
    }
    findRoute(name){
        const result = window.router.routes.find(route=>route.name==name);
        if(!result) throw Error("route not find");
        return result;
    }
    navigate(to,from){
        let globalGuards = [];
        guards.beforeGuards.list().forEach(guard=>{
            globalGuards.push(guards.guardToPromiseFn(guard, to, from));
        })
        return (guards.runGuardQueue(globalGuards))
    }
    changeLocation(to,from,state , replace=false){
        this.navigate(to,from).then(()=>{
            window.history[replace ? "replaceState" : "pushState"](state,null,to.path);
        }).catch((err)=>{
            throw err
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
    }
    push(to){
        let toRoute = {};
        let fromRoute = {};
        const currentState=Object.assign({},history.state,{forward:to.path});
        toRoute.name=fromRoute.name=currentState.currentName;
        toRoute.path=fromRoute.path=currentState.current;
        this.changeLocation(toRoute , fromRoute, currentState, true);
        const state = Object.assign({},{back:this.currentLocation.value,current:to.path,forward:null},{ position: currentState.position + 1},{currentName:to.name});
        toRoute.name=state.currentName;
        toRoute.path=state.current;
        fromRoute.name=currentState.currentName;
        fromRoute.path=currentState.current;
        this.changeLocation(toRoute , fromRoute , state);
        this.renderComponent(to.component);
        this.currentLocation.value = to.path;
    }
    replace(to){
        let toRoute = {};
        let fromRoute = {};
        toRoute.name=fromRoute.name=to.name;
        toRoute.path=fromRoute.path=to.path;
        this.changeLocation(toRoute , fromRoute , history.state , true);
        this.renderComponent(to.component)
    }
}
const useHistoryStateNavigation = new historyStateNavigation();
export default useHistoryStateNavigation;