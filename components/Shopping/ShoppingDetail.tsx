import {FC, useEffect, useState,useRef} from "react";
import QRCode from "qrcode.react";
import {getGateWayEndpoint} from "@/utils/app/api";
import {useFetch} from "@/hooks/useFetch";
import {IconX,IconLoader,IconReload,IconCheck} from "@tabler/icons-react";


interface Props {
    productid: string,
    onClose: ()=>void
}

export const ShoppingDetail: FC<Props> = ({productid,onClose}) => {
    const [number,setNumber]=useState(0);
    const [qrAddress,setQrAddress] = useState('');
    const [product,setProduct]=useState({});
    const [payList,setPayList] = useState([]);
    const [payName,setPayName] = useState('支付宝');
    const [orderId,setOrderId] = useState('');
    const [payLoading,setPayLoading] = useState(false);
    const [isCreatedOrder,setIsCreatedOrder] = useState(false);
    const [isPaySuccess,setIsPaySuccess] = useState(false);
    const [currentPayMethod,setCurrentPayMethod] = useState('');
    const fetchService= useFetch();
    const [intervalId,setIntervalId]= useState<NodeJS.Timeout | null >();
    const counterRef = useRef(0); // 使用 useRef 来存储计数器

    const handleQuantityChange = ( action: string) => {
       action === 'increment' ?  setNumber(number+1) :  setNumber(number-1)
        setQrAddress('')
    };
    const selectAllPaymethods=async ()=>{
        const url =  getGateWayEndpoint("showAllpaymethods");
        const res = await fetchService.post(url)
        if (res.data){
            setPayList(res.data);
        }
    }
    const selectProtect= async ()=>{
        const url =  getGateWayEndpoint("productDetail")+"/"+productid;
        const res = await fetchService.get(url)
        if (res.data){
            setProduct(res.data);
            selectAllPaymethods();
        }
    }

    const orderQuery=async ()=>{
        const url =  getGateWayEndpoint("orderQuery");
        const body={
            orderId
        };
       const res=  await fetchService.post(url,{body})
        if (res.data){
            const data= res.data;
            if (data){
               const payList=  data.payresults;
                payList.map((entity:any)=>{
                    if (entity.isCreated){
                        setPayLoading(true);
                        setIsCreatedOrder(true);
                        counterRef.current = 12; // 重置计数器
                        return;
                    }
                })
            }
            const pendingList= ['waitepaid','pending'];
           if (data.totoStatus==='paid'||'completed'===data.totoStatus){
               setQrAddress('');
               alert("支付成功,请刷新页面")
           }else if (!pendingList.includes(data.totoStatus)){
               closeAll();
               alert("支付失败")

           }
        }
    }
    const closeAll= ()=>{
        if (intervalId) {
            clearInterval(intervalId);
        }
        counterRef.current = 0; // 重置计数器
        if (orderId){
            setOrderId('')
        }
        setPayLoading(false)
    }
    useEffect(()=>{
        selectProtect();
    },[productid])
    useEffect(()=>{
        if (qrAddress&&orderId) {
            const tempIntervalId = setInterval(() => {
                orderQuery();
                counterRef.current += 1;
                //1分钟
                console.log("count=",counterRef.current)
                if (counterRef.current >= 24) {
                    setQrAddress('')
                    if (isCreatedOrder){
                        alert("订单处理中，可能会有延迟请耐心等候");
                    }else {
                        alert("订单超时,请重新下单");
                    }
                    closeAll();
                }
            }, 5000);
            setIntervalId(tempIntervalId);
        } else {
            closeAll();
        }
        return () => {
            closeAll();
        };
    },[qrAddress])

    const generatorQrCode= async (products,number,paymethod,goodName) =>{
        const goodsList= [];
        products.map((data)=>
            goodsList.push({
                id: data.id,
                merchanUuid: data.userUuid,
                number: number,
                productName: data.goodsName
            })
        )
        const body= {
            payMethod: paymethod.payCode,
            payType: 'qrScan',
            remark: goodName,
            productsList: goodsList
        }
        const res = await fetchService.post( getGateWayEndpoint("makeOrder"),{body})
        if (res.data){
            setOrderId(res.data.orderId)
            setQrAddress(res.data.codeUrl);
            setPayName(paymethod.payName);
            counterRef.current = 0; // 重置计数器
        }
    }

    const makeOrder= (paymethod:string)=>{
        if (number<1){
            alert("购买的商品数量必须大于0")
            return ;
        }
        const isConfirmed = window.confirm('请确认您购买的商品和商品数量是否正确，1分钟只能够下单一次！！');
        if (isConfirmed){
            const products = []
            products.push(product)
            generatorQrCode(products,number,paymethod,product.goodsName)
            selectProtect();
        }
    }
    const handleQuantityInputChange = ( value:number|string) => {
        // Handle direct input into the quantity input field
       setNumber( parseInt(value, 10))
       setQrAddress('')
    };

    return (
       <>
            <div     className="flex flex-wrap bg-white  justify-center  -m-4 ">
               <div key={product.id} className="p-4 w-1/2 justify-center text-black  items-center text-center">
                       <div className="h-full  p-6 rounded-lg shadow-md">
                           <img src={product.imgUrl} alt="商品图片" className="object-contain w-full h-48 mb-2" />
                           <h2 className="mb-1">{product.goodsName}</h2>
                           <p className="mb-1 text-red-950">价格: <span className="text-red-700">{product.price}元  </span></p>
                           <p className="mb-1  "> 商品描述: <span className="text-red-700">{product.goodsDescription}</span> </p>
                           <p className="text-red-950">库存: {product.stock}</p>
                           <div className=" p-6 rounded-lg shadow-md">
                               购买数量
                               {/* Quantity Selector */}
                               <div className="flex items-center justify-center space-x-4 mb-4">
                                   <button disabled={payLoading} className="text-4xl" onClick={() => handleQuantityChange('decrement')}>-</button>
                                   <input  className="text-center" type="number" value={number} onChange={(e) => handleQuantityInputChange( e.target.value)} />
                                   <button disabled={payLoading} className="text-4xl" onClick={() => handleQuantityChange( 'increment')}>+</button>
                               </div>


                           </div>

                           {payList.map((paymethod,index2)=>{
                               return  <div key = {paymethod.id} onClick={()=>{
                                   setCurrentPayMethod(paymethod)
                                   makeOrder(paymethod)
                               }}  className="flex items-center justify-center space-x-2 border-2 border-amber-400" style={{cursor: 'pointer'}}>
                                   <img src={paymethod.payPic} alt={paymethod.payName} className="h-8" />
                                   <span className="flex items-center">{paymethod.payName}方式购买</span>
                               </div>

                           })}
                       </div>

               </div>
                {qrAddress ?  <div className="flex flex-col p-4  w-1/2  text-black justify-center items-center text-center bottom-10 ">
                    {isPaySuccess ?  <>
                        支付成功
                        <div className="mt-10">
                            <IconCheck size={25}/>
                        </div>
                    </>:
                       payLoading?(
                               <>
                                   订单处理中，请等待结果
                                   <div className="mt-10">
                                       <IconLoader/>
                                   </div>
                               </>
                           ): (<>
                               请使用{payName}扫描下方二维码付款,2分钟后自动关闭订单,订单号:{orderId}：
                               <div className="mt-10">
                                   <QRCode value={qrAddress} size={300} />
                                   <div className="text-black mt-5" onClick={()=>{
                                       makeOrder(currentPayMethod)}}>
                                       刷新二维码:
                                       <IconReload className="inline-block" size={25} />
                                   </div>
                               </div>
                           </>)
                        }

                </div>: ''}
                {/* 关闭图标 */}
                <div className="absolute top-0 right-0 p-2">
                    <IconX  size={50} className='text-black' onClick={onClose} />
                </div>


            </div>

       </>
     )
}