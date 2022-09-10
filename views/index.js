export default{
    template:`
    <div class="main-nav">
    <ul>
        <li>
            <router-link to="/home/1234/aida">home</router-link>
        </li>
        <li>
            <router-link to="/about/1234">about</router-link>
        </li>
        <li>
            <router-link to="/contact/1234">contact</router-link>
        </li>
        <li>
            <router-link to='{"name":"home" , "params":{"id":1234} , "query":{"name":"aida","lastname":"attarzade"}}'>home</router-link>
        </li>
    </ul>
</div>
<div class="main-body">
    <router-view></router-view>
</div>
    `
}