import AddressesContext, {
  defaultAddressContext,
} from '#context/AddressContext'
import React, {
  FunctionComponent,
  ReactNode,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import addressReducer, {
  addressInitialState,
  AddressSchema,
  setAddressErrors,
  SetAddressParams,
  setCloneAddress,
} from '#reducers/AddressReducer'
import { BaseError } from '#typings/errors'
import OrderContext from '#context/OrderContext'
import CommerceLayerContext from '#context/CommerceLayerContext'
import { saveAddresses } from '#reducers/AddressReducer'
import components from '#config/components'

const propTypes = components.AddressesContainer.propTypes
const displayName = components.AddressesContainer.displayName

export type AddressesContainerProps = {
  children: ReactNode
  shipToDifferentAddress?: boolean
}
const AddressesContainer: FunctionComponent<AddressesContainerProps> = (
  props
) => {
  const { children, shipToDifferentAddress = false } = props
  const [state, dispatch] = useReducer(addressReducer, addressInitialState)
  const { order, orderId, getOrder } = useContext(OrderContext)
  const config = useContext(CommerceLayerContext)
  useEffect(() => {
    dispatch({
      type: 'setShipToDifferentAddress',
      payload: {
        shipToDifferentAddress,
      },
    })
    return () => {
      dispatch({
        type: 'cleanup',
        payload: {},
      })
    }
  }, [shipToDifferentAddress])
  const contextValue = {
    ...state,
    setAddressErrors: (
      errors: BaseError[],
      resource: 'billingAddress' | 'shippingAddress'
    ) =>
      setAddressErrors({
        errors,
        resource,
        dispatch,
        currentErrors: state.errors,
      }),
    setAddress: (params: SetAddressParams<AddressSchema>) =>
      defaultAddressContext['setAddress']({ ...params, dispatch }),
    saveAddresses: async (): Promise<void> =>
      await saveAddresses({
        config,
        dispatch,
        getOrder,
        order,
        orderId,
        state,
      }),
    setCloneAddress: (
      id: string,
      resource: 'billingAddress' | 'shippingAddress'
    ): void => setCloneAddress(id, resource, dispatch),
  }
  return (
    <AddressesContext.Provider value={contextValue}>
      {children}
    </AddressesContext.Provider>
  )
}

AddressesContainer.propTypes = propTypes
AddressesContainer.displayName = displayName

export default AddressesContainer
