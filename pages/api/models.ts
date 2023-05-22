import { OPENAI_API_HOST, OPENAI_API_TYPE, OPENAI_API_VERSION, OPENAI_ORGANIZATION,CLIENTID } from '@/utils/app/const';

import {tokenToUserId} from "@/utils/server/login";
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
    let url = `${OPENAI_API_HOST}/openAI/v1/models`;
    if (OPENAI_API_TYPE === 'azure') {
      url = `${OPENAI_API_HOST}/openai/deployments?api-version=${OPENAI_API_VERSION}`;
    }
    let userId = await tokenToUserId(access_token);
    if (!userId){
      return new Response('Error', { status: 501 });
    }
    console.log("userID,ClientID=",userId,CLIENTID)
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'auth-info':  userId+"|"+CLIENTID,
        ...((OPENAI_API_TYPE === 'openai' && OPENAI_ORGANIZATION) && {
          'OpenAI-Organization': OPENAI_ORGANIZATION,
        }),
      },
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
    let models: OpenAIModel[]=[];
    if (json.data){
      models = json.data
          .map((model: any) => {
            const model_name = (OPENAI_API_TYPE === 'azure') ? model.model : model.id;
            for (const [key, value] of Object.entries(OpenAIModelID)) {
              if (value === model_name) {
                return {
                  id: model.id,
                  name: OpenAIModels[value].name,
                };
              }
            }
          })
          .filter(Boolean);
    }


    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
