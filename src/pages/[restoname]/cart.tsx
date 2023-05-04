import React, { useState, useEffect, useRef } from "react";
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next'
import Head from 'next/head'
import Link from 'next/link';
import Image from "next/image";
// import libraries
import Swal from "sweetalert2";
// import helper functions
import axios, { restaurant, createOrder, checkPremium } from '../../helper/axios';
import { getCart, readRestaurantID, updateCart, writeRestaurantID } from "../../helper/session";
// import components
import { formatMoney, getNumber, slugify } from "../../helper/others";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
// import models
import CartModel from "../../models/CartModel";

const Cart = React.memo(() => {
    const { t, i18n } = useTranslation()
    const router = useRouter()
    const { restoname } = router.query

    const [currency, setCurrency] = useState('$');
    const [minHeight, setMinHeight] = useState('400px');
    const [starting, setStarting] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [cart, setCart] = useState<CartModel[]>([]);
    const [notFoundEditing, setNotFoundEditing] = useState(true);
    const [customer, setCustomer] = useState('');
    const [table, setTable] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [lastFocus, setLastFocus] = useState(0);
    const [restoID, setRestoID] = useState(0);
    const total = useRef(0);

    interface CartProps {
        cart: CartModel
    }

    const updateNoteCart = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        const newCart = cart.map((item) => {
            if (item.id === id) {
                const note = (e.target as HTMLInputElement).value;
                item.note = note;
            }
            return item;
        });

        let item = e.target as HTMLInputElement;
        //item.setAttribute("style", "height:" + (item.scrollHeight) + "px;overflow-y:hidden;");
        item.addEventListener('input', () => {
            item.style.height = "auto";
            item.style.height = (item.scrollHeight) + "px";
        });
        updateCart(restoname, newCart);
    }

    const addQtyCart = (id: number) => {
        const newCart = getCart(restoname).map((item: CartModel) => {
            if (item.id === id) {
                item.qty += 1;
            }
            return item;
        });
        setCart(newCart);
        updateCart(restoname, newCart);
        calculateTotal();
    }

    const removeQtyCart = (id: number) => {
        const newCart = getCart(restoname).map((item: CartModel) => {
            if (item.id === id) {
                item.qty -= 1;
            }
            return item;
        });
        setCart(newCart);
        updateCart(restoname, newCart);
        calculateTotal();
    }

    const updateQtyCart = (e: React.FormEvent, id: number) => {
        setLastFocus(id);
        let qty = (e.target as HTMLInputElement).value;
        const lastQty = cart.filter((item) => item.id === id)[0].qty;
        (e.target as HTMLInputElement).placeholder = `${lastQty}`;
        if (qty === '') {
            return;
        }

        if (qty === '0') {
            (e.target as HTMLInputElement).value = '1';
            return;
        }

        if (qty.length > 3) {
            (e.target as HTMLInputElement).value = '999';
            return;
        }

        const newCart = getCart(restoname).map((item: CartModel) => {
            if (item.id === id) {
                item.qty = parseInt(qty);
                // console.log(`qty : ${parseInt(qty)}`);
            }
            return item;
        });

        updateCart(restoname, newCart);
        setCart(newCart);
        calculateTotal();
    }

    const deleteCart = (id: number) => {
        Swal.fire({
            title: `${t('delete-menu')}`,
            text: `${t('delete-menu-text')}`,
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: `${t('cancel')}`,
            confirmButtonText: `${t('confirm-delete')}`,
        }).then((result) => {
            if (result.isConfirmed) {
                const newCart = cart.filter((item) => item.id !== id);
                setCart(newCart);
                updateCart(restoname, newCart);
                calculateTotal();
                changseSizeNotFound();
            }
        })
    }


    const calculateTotal = (newCart: CartModel[] = []) => {
        let newTotal = 0;
        if (newCart.length === 0) {
            getCart(restoname).forEach((item: CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(getNumber(item.harga).toString());
            });
        } else {
            newCart.forEach((item: CartModel) => {
                newTotal += parseFloat(item.qty.toString()) * parseFloat(getNumber(item.harga).toString());
            });
        }

        total.current = newTotal;
    }

    const CartContent = React.memo(({ cart }: CartProps) => {
        return (
            <div title={slugify(cart.nama).toString()} className="cart-items w-100 flex-column my-2" key={cart.nama}>
                <div className="d-flex align-items-center flex-row w-100">
                    <img src={`${cart.cover[0]}`} alt="" className="product-cover mr-3" />
                    <div className="flex-column flex-fill">
                        <p className="bodytext1 color-green900 max-line-2 semibold m-0 pb-1">{cart.nama}</p>
                        <p className="bodytext2 color-green900 font-weight-bold m-0">{cart.harga}</p>
                        <div className="content-qty d-flex align-items-center flex-row mt-2">
                            <button onClick={() => cart.qty > 1 ? removeQtyCart(cart.id) : deleteCart(cart.id)} type="button" className="btn-qty btn-qty-minus bodytext2">-</button>
                            {cart.id === lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty} autoFocus />}
                            {cart.id !== lastFocus && <input type="number" placeholder="1" maxLength={3} max={999} min={1} onKeyUp={(e) => updateQtyCart(e, cart.id)} className={`textarea-${cart.id} text-center input-qty bodytext2 mx-2`} defaultValue={cart.qty} />}
                            <button onClick={() => addQtyCart(cart.id)} type="button" className="btn-qty btn-qty-plus bodytext2">+</button>
                        </div>
                    </div>
                    <a href="#" className="navbar-brand" title="delete" onClick={() => deleteCart(cart.id)}>
                        <i className="fi fi-rr-trash color-black600 headline5"></i>
                    </a>
                </div>
                <textarea className="caption m-0 w-100 mt-3" rows={1} placeholder={`${t('write-note')}`} onChange={(e) => updateNoteCart(e, cart.id)} defaultValue={cart.note}></textarea>
            </div>
        );
    });

    const changseSize = () => {
        let height = window.innerHeight;
        let productContainer = document.querySelector('.section-product');
        if (productContainer !== null) {
            productContainer.setAttribute('style', `min-height: ${height - 232}px`);
        }
        setMinHeight(`${height - 56}px`);
    }

    const checkStatusPremium = async (id: Number) => {
        await axios.post(checkPremium, {
            resto_id: id
        }).then(response => {
            let result = response.data;
            // console.log(result.message);
            if (result.status) {
                writeRestaurantID(id);
                setRestoID(parseInt(id.toString()));
            } else {
                writeRestaurantID(0);
                setRestoID(0);
            }
        }).catch(error => {
            console.log(error);
            writeRestaurantID(0);
            setRestoID(0);
        });
    }

    const getInformationData = () => {
        setLoading(true);
        axios.get(`${restaurant}/${restoname}`)
            .then(response => {
                let result = response.data;
                if (result.status) {
                    // setProduct(data.data_menu_all);
                    setWhatsapp(result.data.wa);
                    // console.log(result.data.wa);
                    setCart(getCart(restoname));
                    setNotFound(false);
                    setLoading(false);
                    calculateTotal();
                    try {
                        // console.log('resto id : ' + result.resto_id);
                        checkStatusPremium(result.data.resto_id === undefined ? 0 : result.data.resto_id);
                        // console.log(result.data.resto_id === undefined ? 0 : result.data.resto_id);

                        // setRestoID(27);
                        // console.log('resto id : ' + 27);
                    } catch (error) {
                        // console.log(error);
                    }
                } else {
                    setCart([]);
                    setNotFound(true);
                    setLoading(false);
                    changseSizeNotFound();
                    setRestoID(0)
                    writeRestaurantID(0);

                    window.location.href = `https://daftarmenu.com/resto/${restoname}`;
                }
            }).catch(error => {
                // console.log(error);
                setRestoID(parseInt(readRestaurantID()!.toString()));
                setLoading(false);
            });
    }

    const changseSizeNotFound = () => {
        let height = window.innerHeight;
        let emptyContainer = document.querySelector('.container-empty');
        if (notFound && emptyContainer !== null) {
            emptyContainer.setAttribute('style', `min-height: ${height - 110}px`);
            setNotFoundEditing(false);
        }
    }

    const sendCart = () => {
        if (getCart(restoname).length > 0) {
            if (customer !== '') {
                if (restoID === 0) {
                    let message = `Pesanan A.N : ${customer}%0a%0a`;
                    // foraeach with index
                    getCart(restoname).forEach((item: CartModel, index: number) => {
                        let menuName = item.nama.replace(/[!"#$%&'()*+,/:;=?@\[\]]/g, '');
                        message += `${index + 1}. ${menuName} (${item.qty}x)%0a`;
                        if (item.note !== '') {
                            message += `*Catatan* : ${item.note}%0a%0a`;
                        }
                    });

                    // replace first number in whatsapp number with +62
                    let whatsappNumber = whatsapp.replace(/^0/, '+62');
                    // window.open(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`, '_blank');
                    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
                } else {
                    if (table === '') {
                        Swal.fire({
                            title: `${t('reset-title')}`,
                            text: `${t('enter-table-number-first')}`,
                            icon: 'warning',
                            confirmButtonText: 'Ok',
                        });
                    } else {
                        submitOrder();
                    }
                }
            } else {
                Swal.fire({
                    title: `${t('reset-title')}`,
                    text: `${t('enter-customer-name-first')}`,
                    icon: 'warning',
                    confirmButtonText: 'Ok',
                });
            }
        } else {
            Swal.fire({
                title: `${t('reset-title')}`,
                text: `${t('cart-empty')}`,
                icon: 'warning',
                confirmButtonText: 'Ok',
            });
        }
    }

    const resetCart = () => {
        Swal.fire({
            title: `${t('reset-title')}`,
            text: `${t('reset-text')}`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: `${t('reset-yes')}`,
            cancelButtonText: `${t('reset-no')}`,
        }).then((result) => {
            if (result.isConfirmed) {
                updateCart(restoname, []);
                setCart([]);
                calculateTotal();
            }
        });
    }

    interface MenuModel {
        menu_id: number;
        menu_name: string;
        menu_note: string;
        menu_price: number;
        menu_qty: number
    }

    const dialogSubmitOrderError = () => {
        Swal.fire({
            title: `${t('failed-to-create-order')}`,
            text: `${t('something-went-wrong')}`,
            icon: 'error',
        });
    }

    const dialogSubmitOrderSuccess = () => {
        Swal.fire({
            title: `${t('order-successfully-created')}`,
            text: `${t('order-successfully-created-text')}`,
            icon: 'success',
            allowOutsideClick: false
        }).then(() => {
            window.location.href = `https://daftarmenu.com/resto/${restoname}`;
        });
    }

    const submitOrder = async () => {
        Swal.fire({
            title: `${t('please-wait')}`,
            text: `${t('processing-order')}`,
            allowOutsideClick: false,
            allowEscapeKey: false,
            allowEnterKey: false,
            didClose() {

            },
            didOpen: () => {
                Swal.showLoading();
                // prepare cart
                let preparedCart: MenuModel[] = [];
                getCart(restoname).map((item: CartModel) => {
                    console.log(item);

                    preparedCart.push({
                        menu_id: item.id,
                        menu_name: item.nama,
                        menu_note: item.note,
                        menu_price: parseInt(getNumber(item.harga).toString()),
                        menu_qty: item.qty
                    });
                });

                axios.post(createOrder, {
                    resto_id: restoID,
                    username: customer,
                    total: total.current,
                    table: table,
                    creator_id: 0,
                    tipe_trx: 1,
                    menus: preparedCart
                }).then((res) => {
                    Swal.close();
                    if (res.data.status === true) {
                        updateCart(restoname, []);
                        setCart([]);
                        calculateTotal();

                        dialogSubmitOrderSuccess();
                    } else {
                        dialogSubmitOrderError();
                    }
                }).catch((err) => {
                    Swal.close();
                    // console.log('terjadi kesalahan');
                    // console.log(err);
                    dialogSubmitOrderError();
                })
            },
        });


    }

    useEffect(() => {
        if (router.isReady) {
            changseSize();
            if (restoname === undefined) {
                setNotFound(true);
                setLoading(false);
                changseSizeNotFound();
            } else {
                getInformationData();
            }
            setStarting(false);
        }
    }, [router.isReady]);

    return (
        <>
            <Head>
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>DaftarMenu - Cart</title>
            </Head>
            <nav className="navbar fixed-top background-green500 col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto">
                <div className="d-flex flex-row align-items-center py-0 w-100">
                    <Link href={`/${restoname}`} className="navbar-brand" title="back">
                        <i className="fi fi-sr-angle-left text-white headline6"></i>
                    </Link>
                    <p className="mb-0 bodytext1 semibold text-white px-2 flex-fill">{t('cart')}</p>
                    <a href="#" onClick={resetCart} className="navbar-brand m-auto" title="clear">
                        <i className="fi fi-br-rotate-right text-white headline6"></i>
                    </a>
                </div>
            </nav>
            {loading && <Loading height={minHeight} />}
            <main role="main" className="container-fluid col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 pt-0 pl-0 pr-0" style={{ marginTop: '60px', marginBottom: cart.length > 0 ? restoID === 0 ? '175px' : '280px' : '0px' }}>
                {!starting && !notFound &&
                    <>
                        <div className="section-product w-100">

                            {!loading && cart.length === 0 &&
                                <EmptyState minHeight={`${minHeight}`} desc={`${t('no-menu')},</br>${t('please-add-menu')}`} />}

                            {!loading && cart.length > 0 &&
                                <div id="container-product" className="container-product d-flex justify-content-start d-flex w-100 flex-column px-3">
                                    {!loading && cart.length > 0 && cart.map((cart: CartModel, index: number) => <CartContent cart={cart} key={`cart-${index}`} />)}
                                </div>
                            }

                        </div>
                    </>
                }

                {notFound && <EmptyState minHeight={`${minHeight}`} title={`${t('page-not-found')}`} desc={'Mau pake linknya? <u><a href="https://daftarmenu.com" class="color-green800" target="_blank" rel="noopener noreferrer">Buat daftarmenu sekarang.</a></u>'} icon={require('../assets/icons/not-found.svg')} />}

            </main>
            {cart.length > 0 &&
                <div className="container-checkout-cart py-3 px-4 d-flex fixed-bottom bg-white col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12 m-auto flex-column">
                    <p className="m-0 bodytext2 color-green900 semibold pb-2">
                        {t('customer-name')}:
                    </p>
                    <div className="input-group-search h-100 w-100 input-name">
                        <input type="text" className="w-100 bodytext2 color-green900" onChange={(e) => setCustomer(e.target.value)} placeholder={`${t('enter-customer-name')}`} />
                    </div>
                    {restoID !== 0 &&
                        <>
                            <p className="m-0 bodytext2 color-green900 semibold pb-2 mt-3">
                                {t('table-number')}:
                            </p>
                            <div className="input-group-search h-100 w-100 input-name">
                                <input type="text" className="w-100 bodytext2 color-green900" onChange={(e) => setTable(e.target.value)} placeholder={`${t('enter-table-number')}`} />
                            </div>
                        </>
                    }

                    <div className="d-flex flex-row align-items-center w-100 mt-3">
                        <div className="d-flex flex-column w-50">
                            <p className="m-0 bodytext2 color-green900 semibold pb-1">
                                {t('total-payment')}
                            </p>
                            <p className="m-0 headline6 color-green900 semibold">
                                {currency} {formatMoney(total.current)}
                            </p>
                        </div>
                        <button onClick={sendCart} className="button-message w-50 flex-fill bodytext1 semibold text-white d-flex flex-row justify-content-center align-items-center background-green500" type="button">
                            <p className="mb-0 py-1">
                                {t('order-now')}
                            </p>
                        </button>
                    </div>
                </div>
            }

        </>
    )
})

Cart.displayName = 'Cart';
export default Cart;