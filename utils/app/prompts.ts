import { Prompt } from '@/types/prompt';

export const updatePrompt = (updatedPrompt: Prompt, allPrompts: Prompt[]) => {
  const updatedPrompts = allPrompts.map((c) => {
    if (c.id === updatedPrompt.id) {
      return updatedPrompt;
    }

    return c;
  });

  savePrompts(updatedPrompts);

  return {
    single: updatedPrompt,
    all: updatedPrompts,
  };
};

export const savePrompts = (prompts: Prompt[]) => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  localStorage.setItem('prompts'+user_uuid, JSON.stringify(prompts));
};

export const getPrompts = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
 return  localStorage.getItem('prompts'+user_uuid);
};