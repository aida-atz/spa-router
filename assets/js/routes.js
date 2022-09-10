const routes=[   
    {
        name:"index",
        path:"/",
        component:()=> import("../../views/index.js"),
    },
    {
        name:"home",
        path:"/home/:id",
        component:()=> import("../../views/home.js"),
    },
    {
        name:"about",
        path:"/about/:id",
        component:()=>import("../../views/about.js"),
    },
    {
        name:"contact",
        path:"/contact/:id",
        component:()=> import("../../views/contact.js"),
        beforeEnter: (to, from) => {
            console.log("beforeEnter");
            return true
        },
    },
]
export default routes;