"use client"
import React, { useState } from 'react'
import { Button } from './ui/button'
import axios from 'axios'

type Props = {isPro: boolean}

const SubscriptionButton = (props: Props) => {
    const [loading, setLoading] = useState(false)
    const handleSubscription = async () => {
        try {
            setLoading(true)
            const response = await axios.get('/api/stripe')
            window.location.href = response.data.url

        } catch (error) {
            console.log('Error upgrading to pro', error)
        } finally {
            setLoading(false)
        }
    }


  return (
    <Button disabled={loading} onClick={handleSubscription} variant='outline'>
        {
            props.isPro ? 'Manage Subscription' : 'Get Pro'
        }
    </Button>
  )
}

export default SubscriptionButton