import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { isAuthenticated } from '../auth/helper';
import { cartEmpty, loadCart } from './helper/cartHelper';
import { createOrder } from './helper/orderHelper';
import { getmeToken, processPayment } from './helper/paymentbhelper';

import DropIn from 'braintree-web-drop-in-react';

const Paymentb = ({products, setReload = f => f, reload = undefined }) => {

    const [info, setInfo] = useState ({
        loading: false,
        success: false,
        clientToken: null,
        error: "",
        instance: {}
    });

    const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

    const getToken = (userId, token) => {
        getmeToken(userId, token).then(info => {
            if (info.error) {
                setInfo({...info, error: info.error})
            }else {
                const clientToken = info.clientToken
                setInfo({clientToken})
            }
        })
    }

    const onPurchase = () => {
        setInfo({ ...info,loading: true})
        let nonce = null;
        let getNonce = info?.instance?.requestPaymentMethod()
        .then(data => {
            nonce = data?.nonce;
            const paymentData = {
                paymentMethodNonce: nonce,
                amount: getAmount()
            };
              processPayment(userId,token,paymentData)
              .then(response => {
                  setInfo({...info, success: response.success, loading: false});
                  const orderData = {
                      products: products,
                      transaction_id: response.transaction.id,
                      amount: response.transaction.amount,
                  };
                  createOrder(userId, token, orderData);
                  cartEmpty(() => {
                      console.log("Did we got a crash!");
                  });
                  setReload(!reload);
              })
              .catch(error => {
                  setInfo({...info,loading: false, success: false});
              })
          })
    }

    const getAmount = () => {
        let amount = 0
        products.map(p => {
            amount = amount + p.price
        })
        return amount
    }

    const showbtdropIn = () => {
        return(
            <div>
                {info.clientToken !== null && products.length > 0 ? (
                     <div>
                        <DropIn
                            options={{ authorization: info.clientToken }}
                            onInstance={(instance) => (info.instance = instance)}
                        />
                        <button className="btn btn-block btn-success" onClick={onPurchase}>Buy</button>
                   </div>
                ) : (
                <h3>Please Login or Add something to cart</h3>
                )}
            </div>
        );
    };

    useEffect(() => {
        getToken(userId, token);
    }, [])

    return (
        <div>
         <h3>Your bill is {getAmount()} $</h3>
         {showbtdropIn()}
        </div>
    );
};

export default Paymentb;