import { icons } from '@/constants/icons'
import React from 'react'
import { Image, Text, View } from 'react-native'

const profile = () => {
  return (
    <View className='flex-1 bg-primary'>
      <View className='flex flex-col flex-1 items-center justify-center gap-5'>
        <Image
          source={icons.person}
          className='size-10 rounded-full' 
          tintColor='#fff'
        />
        <Text className='text-light-200 text-base font-semibold'>Profile</Text>
      </View>
    </View>
  )
}

export default profile