import React, { useState, useEffect, Fragment } from 'react'
import { getCustomerToken } from '@commercelayer/js-auth'
import { Nav } from '.'
import Head from 'next/head'
import {
  CommerceLayer,
  LineItem,
  OrderContainer,
  Shipment,
  ShipmentsContainer,
  LineItemImage,
  LineItemName,
  LineItemQuantity,
  ShippingMethodName,
  ShippingMethod,
  ShippingMethodRadioButton,
  ShippingMethodPrice,
  LineItemsContainer,
  StockTransfer,
  StockTransferField,
  DeliveryLeadTime,
  ShipmentField,
} from '@commercelayer/react-components'
import { Order } from '@commercelayer/js-sdk'
import { isEmpty } from 'lodash'
import { useRouter } from 'next/router'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID as string
const endpoint = process.env.NEXT_PUBLIC_ENDPOINT as string
const scope = process.env.NEXT_PUBLIC_MARKET_ID as string
const username = process.env.NEXT_PUBLIC_CUSTOMER_USERNAME as string
const password = process.env.NEXT_PUBLIC_CUSTOMER_PASSWORD as string
let orderId = 'PDerhJplRp'

export default function Main() {
  const [token, setToken] = useState('')
  const [shippingMethodName, setShippingMethodName] = useState('')
  const [shippingMethodId, setShippingMethodId] = useState<string>('')
  const { query } = useRouter()
  if (query.orderId) {
    orderId = query.orderId as string
  }
  const getOrder = async () => {
    const config = { accessToken: token, endpoint }
    const order = await Order.withCredentials(config).find(orderId)
    const shipments = await order
      .withCredentials(config)
      .shipments()
      ?.includes('shippingMethod')
      .load()
    if (!isEmpty(shipments) && shipments) {
      const name = shipments.first()?.shippingMethod()?.name
      const id = shipments.first()?.shippingMethod()?.id as string
      setShippingMethodName(name as string)
      setShippingMethodId(id)
    }
  }
  useEffect(() => {
    const getToken = async () => {
      // @ts-ignore
      const token = await getCustomerToken(
        {
          clientId,
          endpoint,
          scope,
        },
        {
          username,
          password,
        }
      )
      if (token) setToken(token.accessToken)
    }
    if (!token) getToken()
    if (token) getOrder()
  }, [token])
  const handleChange = (shippingMethod: any) => {
    setShippingMethodName(shippingMethod.name)
    setShippingMethodId(shippingMethod.id)
  }
  return (
    <Fragment>
      <Head>
        <script src="http://localhost:8097"></script>
      </Head>
      <Nav links={['/multiOrder', '/multiApp', '/giftCard']} />
      <CommerceLayer accessToken={token} endpoint={endpoint}>
        <div className="container mx-auto mt-5 px-5">
          <OrderContainer orderId={orderId}>
            <ShipmentsContainer>
              <Shipment loader={<>Caricamento...</>}>
                <div className="flex">
                  Shipments N:
                  <ShipmentField className="font-bold pl-1" name="keyNumber" />
                </div>
                <LineItemsContainer>
                  <LineItem>
                    <div className="flex justify-between items-center border-b p-5">
                      <LineItemImage className="p-2" width={80} />
                      <LineItemName data-cy="line-item-name" className="p-2" />
                      <LineItemQuantity
                        readonly
                        data-cy="line-item-quantity"
                        max={100}
                        className="p-2"
                      />
                    </div>
                    <div>
                      <StockTransfer>
                        <div className="flex flex-row" data-cy="stock-transfer">
                          <StockTransferField
                            className="px-1"
                            type="quantity"
                          />{' '}
                          of <LineItemQuantity readonly className="px-1" />
                          items will undergo a transfer
                        </div>
                      </StockTransfer>
                    </div>
                  </LineItem>
                </LineItemsContainer>
                <ShippingMethod>
                  <div className="flex justify-around w-2/3 items-center p-5">
                    <ShippingMethodRadioButton
                      data-cy="shipping-method-button"
                      onChange={handleChange}
                    />
                    <ShippingMethodName data-cy="shipping-method-name" />
                    <ShippingMethodPrice data-cy="shipping-method-price" />
                    <div className="flex">
                      <DeliveryLeadTime
                        type="minDays"
                        data-cy="delivery-lead-time-min-days"
                      />{' '}
                      -{' '}
                      <DeliveryLeadTime
                        type="maxDays"
                        data-cy="delivery-lead-time-max-days"
                        className="mr-1"
                      />
                      days
                    </div>
                  </div>
                </ShippingMethod>
              </Shipment>
            </ShipmentsContainer>
            <div className="mt-10">
              <ShipmentsContainer>
                <div>Shipments Recap</div>
                <Shipment>
                  <div>
                    <ShippingMethod readonly>
                      <div className="flex justify-around w-2/3 items-center p-5">
                        <ShippingMethodName data-cy="shipping-method-name-recap" />
                        <ShippingMethodPrice />
                        <div className="flex">
                          <DeliveryLeadTime type="minDays" /> -{' '}
                          <DeliveryLeadTime type="maxDays" className="mr-1" />
                          days
                        </div>
                      </div>
                    </ShippingMethod>
                  </div>
                </Shipment>
              </ShipmentsContainer>
            </div>
          </OrderContainer>
          <div className="mt-5">
            <pre data-cy="current-shipping-method">{`Current shipping method: ${JSON.stringify(
              shippingMethodName,
              null,
              2
            )}`}</pre>
            <pre data-cy="current-shipping-method-id">{`Current shipping method ID: ${JSON.stringify(
              shippingMethodId,
              null,
              2
            )}`}</pre>
          </div>
        </div>
      </CommerceLayer>
    </Fragment>
  )
}
