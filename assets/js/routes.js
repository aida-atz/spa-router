const routes=[   
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
    },
]
export default routes;