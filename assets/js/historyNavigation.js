import instanceGuards from "./globalGuards.js";
import routes from "./routes.js";
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
    findRouteByPath(path){
        const result = window.router.routes.find(route=>route.path==path);
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
        window.history[replace ? "replaceState" : "pushState"](state,null,to.path)
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
            this.replace(from, currentState);
            const state = Object.assign({},{back:this.currentLocation.value,current:to.path,forward:null},{ position: currentState.position + 1},{currentName:to.name});
            this.changeLocation(to , state);
            instanceGuards.triggerAfterEach(to , from);
            this.renderComponent(to.component);
            this.currentLocation.value = to.path;
        }).catch(err=>{
            throw err
        })

    }
    replace(to ,state=null){
        this.changeLocation(to , state ? state : history.state , true);
        this.renderComponent(to.component);
    }
}
const useHistoryStateNavigation = new historyStateNavigation();
export default useHistoryStateNavigation;