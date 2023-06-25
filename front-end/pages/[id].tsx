import { useRouter } from "next/router";
import Progress from "./ft_transcendence/Dashbord";
import NotExist from "./ft_transcendence/NotExist";

export default function setIt  () {
    const page = useRouter()?.query?.id;
    if (page){
        if (page === "Dashbord"){
            return (
                <Progress />
            );
        }
        return <NotExist />
    }

}