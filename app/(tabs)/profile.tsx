import { icons } from '@/constants/icons'
import { useState } from 'react'
import { ActivityIndicator, Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'

import { useAuth } from '@/context/AuthContext'

const profile = () => {
  const { user, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className='flex-1 bg-primary'>
      <View className='flex-1 bg-primary'>
        <View className='flex flex-col flex-1 items-center justify-center gap-5 px-6'>
          <Image
            source={icons.person}
            className='size-10 rounded-full'
            tintColor='#fff'
          />
          <Text className='text-light-200 text-xl font-semibold'>
            {user?.name || 'Movie Lover'}
          </Text>
          <Text className='text-light-100 text-base'>
            {user?.email}
          </Text>

          <TouchableOpacity
            disabled={loading}
            onPress={handleLogout}
            className='bg-blue-500 rounded-2xl px-8 py-3 mt-6'
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text className='text-white font-semibold'>Sign out</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default profile