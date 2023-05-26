import { NextApiRequest, NextApiResponse } from 'next';

import { REDIRECTURL,API_AUTH_HOST,CLIENTID } from '@/utils/app/const';

import { LoginBody } from '@/types/login';


const handler = async (req: NextApiRequest, res: NextApiResponse<any>) => {
    try {
        const { code } =
            req.body as LoginBody;

        const tokenEntity={
            "grant_type": "authorization_code",
            "code": code,
            "redirect_uri": REDIRECTURL,
            "client_id": CLIENTID
        }
        const queryToken = `${API_AUTH_HOST}queryToken`
        console.log("queryToken",queryToken)
        const authRes = await fetch(
            queryToken,{
                headers: {
                    'Content-Type': 'application/json',
                },
                method: 'POST',
                body: JSON.stringify(tokenEntity)
            }
        );

        const authJsonData = await authRes.json();
        console.log("换取token:",authJsonData)
        let access_token = '';

        if (authJsonData.data){
            access_token=authJsonData.data.access_token
        }
        console.log("access_token=",access_token)

        const userInfoRes = await fetch(
            `${API_AUTH_HOST}queryUserInfo`,{
                headers: {
                    'Content-Type': 'application/json',
                    'access-token': access_token
                },
                method: 'GET'
            }
        );
        const userInfoDto = await userInfoRes.json();
        console.log("获取用户信息:",userInfoDto)

        const userInfo=userInfoDto.data
        if (userInfo.uuid){
            userInfo.password= ''
            userInfo.uuid=''
        }else {
        return    res.status(501).json({ error: 'Error'})
        }
        console.log("userInfo=",userInfo)
        res.status(200).json({ data: access_token, userInfo:  userInfo });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error'})
    }
};

export default handler;
