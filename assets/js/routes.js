const routes=[   
    {
        name:"index",
        path:"/",
        component:()=> import("../../views/index.js"),
    },
    {
        name:"home",
        path:"/home",
        component:()=> import("../../views/home.js"),
    },
    {
        name:"about",
        path:"/about",
        component:()=>import("../../views/about.js"),
    },
    {
        name:"contact",
        path:"/contact",
        component:()=> import("../../views/contact.js"),
        beforeEnter: (to, from) => {
            console.log("beforeEnter");
            return true
        },
    },
]
export default routes;