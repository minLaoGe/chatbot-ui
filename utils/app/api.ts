import {Plugin, PluginID} from '@/types/plugin';
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
  if (plugin.id === PluginID.COUNT){
      return 'api/count'
  }

  return 'api/chat';
};
export const getGateWayEndpoint = (path: string | null) => {
    let shoppingprefix='/gateway/shopping';
    if (process.env.NODE_ENV === 'production') {
        console.log('当前是生产环境');
    } else  {
        shoppingprefix='/gpt'+shoppingprefix
    }
    if ("showAllpaymethods"===path) {
        return shoppingprefix+'/shopmethods/showAllpaymethods';
    }
   else if ("goods"===path) {
        return shoppingprefix+'/product/goods';
    }else if ("makeOrder"===path){
        return shoppingprefix+"/pay/makeOrder"
    }else if ("productDetail"===path){
        return shoppingprefix+"/product/goodsDetail"
    }else if ("orderQuery"===path){
        return shoppingprefix+"/pay/queryOrder"
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