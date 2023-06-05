import { Conversation } from '@/types/chat';

export const updateConversation = (
  updatedConversation: Conversation,
  allConversations: Conversation[],
) => {
  const updatedConversations = allConversations.map((c) => {
    if (c.id === updatedConversation.id) {
      return updatedConversation;
    }

    return c;
  });

  saveConversation(updatedConversation);
  saveConversations(updatedConversations);

  return {
    single: updatedConversation,
    all: updatedConversations,
  };
};

export const saveConversation = (conversation: Conversation) => {
  const userInfo = sessionStorage.getItem("userInfo");
  const user_uuid = userInfo.uuid;
  localStorage.setItem('selectedConversation'+user_uuid, JSON.stringify(conversation));
};
export const getConversation = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  const selectedConversation = localStorage.getItem('selectedConversation'+user_uuid);
  return selectedConversation;
};
export const removeConversation = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  localStorage.removeItem('selectedConversation'+user_uuid);
};
export const getConversations = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  const selectedConversation = localStorage.getItem('conversationHistory'+user_uuid);
  return selectedConversation;
};
export const removeConversations = () => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  localStorage.removeItem('conversationHistory'+user_uuid);
};
export const saveConversations = (conversations: Conversation[]) => {
  const userInfo = sessionStorage.getItem("userInfo");
  const obj = JSON.parse(userInfo);
  const user_uuid = obj.uuid;
  localStorage.setItem('conversationHistory'+user_uuid, JSON.stringify(conversations));
};
