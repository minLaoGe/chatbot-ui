
export  const getRandomKey=()=>{
    const keyList=process.env.OPENAI_API_KEY;
    if (keyList){
        const keyArray = keyList.split(',');
        const randomKey = keyArray[Math.floor(Math.random() * keyArray.length)];
        return randomKey.trim();
    }
}