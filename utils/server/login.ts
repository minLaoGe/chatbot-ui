import {API_AUTH_HOST} from "@/utils/app/const";


export  const tokenToUserUUID= async (access_token: string)=>{
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
    return userInfo.data.uuid
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


export const getNowDate=()=>{
    const date = new Date(); // 获取当前日期，你也可以通过 new Date('2023-05-22') 设置为指定日期

    const year = date.getFullYear(); // 获取年份
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份并确保是两位数
    const day = ('0' + date.getDate()).slice(-2); // 获取日期并确保是两位数

    const formattedDate = `${year}${month}${day}`; // 格式化日期

    return formattedDate;
}


