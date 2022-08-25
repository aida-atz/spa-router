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
    changeLocation(to,state , replace=false){
        window.history[replace ? "replaceState" : "pushState"](state,null,to);
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
        const currentState=Object.assign({},history.state,{forward:to.path})
        this.changeLocation(currentState.current, currentState, true);
        const state = Object.assign({},{back:this.currentLocation.value,current:to.path,forward:null},{ position: currentState.position + 1},{currentName:to.name});
        this.changeLocation(to.path , state);
        this.renderComponent(to.component);
        this.currentLocation.value = to.path;
    }
    replace(to){
        this.changeLocation(to.path, history.state , true);
        this.renderComponent(to.component)
    }
}
const useHistoryStateNavigation = new historyStateNavigation();
export default useHistoryStateNavigation;