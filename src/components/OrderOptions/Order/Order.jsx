import React from 'react'
import OrderGroup from '../OrderGroup/OrderGroup'
import OrderBtn from '../OrderBtn/OrderBtn'

export default function Order({title, iconName, orderKey}) {
    return (
        <OrderGroup>
            <OrderBtn title={title} orderType='asc' orderKey={orderKey} iconName={iconName}/>
            <OrderBtn title={title} orderType='desc' orderKey={orderKey} iconName={iconName}/>
        </OrderGroup>
    )
}
