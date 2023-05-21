import { Plugin, PluginID } from '@/types/plugin';
import {CLIENTID} from "@/utils/app/const";

export const getEndpoint = (plugin: Plugin | null) => {
  if (!plugin) {
    return 'api/chat';
  }

  if (plugin.id === PluginID.GOOGLE_SEARCH) {
    return 'api/google';
  }
  if (plugin.id === PluginID.LOGIN) {
    return 'api/login';
  }

  return 'api/chat';
};

export  const getMixId = (userIdValue:string)=>{

 if (!userIdValue){
   userIdValue = sessionStorage.getItem("access_token") as string;
    if (!userIdValue){
      return '';
    }
 }
  const mixed= userIdValue+'|'+CLIENTID
  return mixed;
}