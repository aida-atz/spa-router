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
]
export default routes;