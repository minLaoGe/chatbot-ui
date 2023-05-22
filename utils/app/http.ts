import {logout} from "@/utils/common";

export const  myFetch= (input:string , init: object|undefined) =>{
    return fetch(input, init).then(response => {
        if (response.status === 501) {
            logout()
            return Promise.reject(new Error("Error 501"));  //返回一个rejected promise
        }else if (!response.ok){
            const res=  response.json();
            return Promise.reject(new Error("未知错误"))
        }else {
            return response.json();
        }
    });
}