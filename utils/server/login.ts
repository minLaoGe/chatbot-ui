import {API_AUTH_HOST} from "@/utils/app/const";


export  const tokenToUserId= async (access_token: string)=>{
    const userInfoRes = await fetch(
        `${API_AUTH_HOST}queryUserInfo`,{
            headers: {
                'Content-Type': 'application/json',
                'access-token': access_token
            },
            method: 'GET'
        }
    );

    const userInfo = await userInfoRes.json();
    return userInfo.data.id
}

export  const tokenTouserInfo= async (access_token: string)=>{
    const userInfoRes = await fetch(
        `${API_AUTH_HOST}queryUserInfo`,{
            headers: {
                'Content-Type': 'application/json',
                'access-token': access_token
            },
            method: 'GET'
        }
    );

    const userInfo = await userInfoRes.json();
    return userInfo.data
}
