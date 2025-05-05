import Layout from "../Layout";
import Home from "../pages/Home";
import TopicsHome from "../pages/Topics/Topics_home";
import History from "../pages/History";
import HistoryAnswer from "../pages/History/HistoryAnswer";
import HistoryHome from "../pages/History/HistoryHome";
import Login from "../pages/Login";
import Sigup from "../pages/Sigup";
import Questions from "../pages/Questions";
import Topics from "../pages/Topics/index";
export const routes = [
    {
        path: "/",
        element: <Layout />,
        children: [{
            path: "/",
            element: <Home />

        },
        {
            path: "topics",
            element: <TopicsHome />,
            children: [
                {
                    index: true,
                    element: <Topics />
                },
                {
                    path: ":id",
                    element: <Questions />
                }]
        },
        {
            path: "history",
            element: <History />,
            children: [
                {
                    index: true,
                    element:<HistoryHome/>
                },
                {
                    path: ":id",
                    element: <HistoryAnswer/>
                }
            ]
        }, {
            path: "login",
            element: <Login />,


        }, {
            path: "register",
            element: <Sigup />,
        }
            
        
        ]
    },


    {
        path: "*",
        element: <h1>404 not found</h1>
    }
]