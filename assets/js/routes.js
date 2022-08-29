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
        children:[
            {
                name:"aboutUser",
                path:"user",
                component:()=>import("../../views/aboutUser.js")
            }
        ]
    },
    {
        name:"contact",
        path:"/contact",
        component:()=> import("../../views/contact.js"),
        beforeEnter: (to, from) => {
            return true
        },
    },
    {
        name:"user",
        path:"/user/:id",
        component:()=> import("../../views/contact.js"),
        beforeEnter: (to, from) => {
            return true
        },
    },
]
export default routes;