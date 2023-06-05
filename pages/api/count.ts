import {
    OPENAI_API_HOST,
    OPENAI_API_TYPE,
    OPENAI_API_VERSION,
    OPENAI_ORGANIZATION,
    CLIENTID,
    API_SECREATE, API_AUTH_HOST
} from '@/utils/app/const';

import {getNowDate, tokenToUserUUID} from "@/utils/server/login";
import { OpenAIModel, OpenAIModelID, OpenAIModels } from '@/types/openai';

export const config = {
    runtime: 'edge',
};

const handler = async (req: Request): Promise<Response> => {
    try {
        const { key } = (await req.json()) as {
            key: string;
        };

        const access_token = req.headers.get('access-token');
        console.log("modles.ts:access_token=",access_token);
        if (!access_token||'undefined'===access_token){
            return new Response('auth error', { status: 501 });
        }
        let url=`${OPENAI_API_HOST}/openai/getLeftCount`
        console.log("请求的路径:",url)
        let tokenToUseruuid = await tokenToUserUUID(access_token);
        if (!tokenToUseruuid||undefined===tokenToUseruuid){
            return new Response('Error', { status: 501 });
        }
        console.log("count;userUUID,ClientID=",tokenToUseruuid,CLIENTID)

        const body= JSON.stringify({
            userUUID: tokenToUseruuid,
            clientId: CLIENTID,
            secreateKey: getNowDate()+API_SECREATE,
        })
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body,
        });

        if (response.status === 401) {
            return new Response(response.body, {
                status: 500,
                headers: response.headers,
            });
        } else if (response.status !== 200) {
            console.error(
                `OpenAI API returned an error ${
                    response.status
                }: ${await response.text()}`,
            );
            throw new Error('OpenAI API returned an error');
        }

        const json = await response.json();

        console.log("剩余次数: ",json)

        return new Response(JSON.stringify(json), { status: 200 });
    } catch (error) {
        console.error(error);
        return new Response('Error', { status: 500 });
    }
};

export default handler;
