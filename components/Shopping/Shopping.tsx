import {FC, useEffect, useRef, useState} from "react";
import {useTranslation} from "next-i18next";

import {useFetch} from "@/hooks/useFetch";
import {getGateWayEndpoint} from "@/utils/app/api";
import {ShoppingDetail} from "@/components/Shopping/ShoppingDetail";
import {PayProperty} from "@/components/Shopping/entity/const";


interface Props {
    open: boolean;
    onClose: () => void;
}


export const Shopping: FC<Props> = ({open, onClose}) => {
    const {t} = useTranslation('sidebar');
    const modalRef = useRef<HTMLDivElement>(null);
    const fetchService= useFetch();

    const [productList,setProductList] = useState([]);
    const [isOpen,setIsOpen] = useState(false);
    const [productid,setProductid] = useState<string>('');


    const selectAllGoods= async ()=>{
        const url =  getGateWayEndpoint("goods");
        const body= {
            client: 'sdf'
        }
        const res = await fetchService.post(url,{body})
        if (res.data){
            setProductList(res.data);
        }
    }

 const toBuy=(product)=>{
        setProductid(product.id)
        setIsOpen(true);
 }
    useEffect(() => {
        const handleMouseDown = (e: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
                window.addEventListener('mouseup', handleMouseUp);
            }
        };

        const handleMouseUp = (e: MouseEvent) => {
            window.removeEventListener('mouseup', handleMouseUp);
            setIsOpen(false)
            onClose();
        };

        window.addEventListener('mousedown', handleMouseDown);


        return () => {
            window.removeEventListener('mousedown', handleMouseDown);
        };

    }, [onClose]);

    useEffect(()=>{
        if (open){
            selectAllGoods();
        }
    },[open,isOpen])

    // Render nothing if the dialog is not open.
    if (!open) {
        return <></>;
    }
    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[100] text-center">
                <div className="fixed inset-0 z-[100]overflow-hidden">
                    <div
                        className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div
                            className="hidden sm:inline-block sm:h-screen sm:align-middle"
                            aria-hidden="true"
                        />

                        <div

                            className=" dark:border-netural-400 inline-block max-h-[400px] transform overflow-y-auto rounded-lg border  bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all  sm:my-8 sm:max-h-[1920px] sm:w-8/12  sm:p-6 sm:align-middle"
                            role="dialog"
                        >


                            {!isOpen?  <div ref={modalRef} className="flex  justify-center flex-wrap bg-white  -m-4">
                                {productList.map((product, index) => (
                                    <div key={product.id} className=" p-4  text-black items-center text-center">
                                        <div className="h-full  p-6 rounded-lg shadow-md">
                                            <img src={product.imgUrl} alt="商品图片" className="object-contain w-full h-48 mb-4" />
                                            <h2 className="mb-2">{product.goodsName}</h2>
                                            <p className="mb-2 text-red-950">价格: {product.price}元</p>
                                            <p className="text-gray-700 mb-4">商品描述: {product.goodsDescription}</p>
                                            <p className="mb-2 text-red-950">库存: {product.stock}</p>

                                            <div   className="flex items-center h-10 justify-center space-x-2 border-2 border-amber-400" onClick={()=>{
                                                toBuy(product)
                                            }} style={{cursor: 'pointer'}}>
                                                <span className="flex items-center" >购买</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>: <ShoppingDetail
                                productid={productid}
                                onClose={()=>{setIsOpen(false)}}
                            />}


                        </div>

                        {/* QR Code */}

                    </div>
                </div>


            </div>
        </>

);
};
