import {logout} from "@/utils/common";

export const myPostFetch = (input: string,body: BodyInit|null) => {
    let access_token = sessionStorage.getItem("access_token")||undefined;
    if (!access_token) {
        logout();
    }


}