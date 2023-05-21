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
        let access_token = '';

        if (authJsonData.data){
            access_token=authJsonData.data.access_token
        }
        console.log("access_token=",access_token)


        res.status(200).json({ data: access_token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error'})
    }
};

export default handler;
