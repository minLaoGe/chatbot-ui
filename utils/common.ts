import {CLIENTID, REDIRECTURL} from "@/utils/app/const";
import {LOGIN_URL} from "@/utils/app/const";
export const logout=()=>{
    sessionStorage.clear();
    window.location.href = `${LOGIN_URL}?redirect_uri=${REDIRECTURL}&client_id=${CLIENTID}`;
}