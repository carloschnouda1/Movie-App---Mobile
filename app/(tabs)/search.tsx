import MovieCard from '@/components/MovieCard'
import SearchBar from '@/components/SearchBar'
import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { fetchMovies } from '@/services/api'
import { updateSearchCount } from '@/services/appwrite'
import useFetch from '@/services/useFetch'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const search = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const {
    data: movies,
    error,
    refetch,
    loading,
    reset
  } = useFetch(() => fetchMovies({
    query: searchTerm
  })); // false because we want to manually fetch the data and stop autofetching

  useEffect(() => {

    // updateSearchCount(searchTerm, movies?.[0] as Movie);

    const timeoutId = setTimeout(async () => {
      if (searchTerm.trim()) {
        await refetch();

      } else {
        reset();
      }
    }, 700);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  useEffect(() => {
    if (movies?.[0] && movies?.length > 0) {
      updateSearchCount(searchTerm, movies[0] as Movie);
    }
  }, [movies]);

  return (
    <View className='flex-1 bg-primary'>
      <Image
        source={images.bg}
        className='absolute w-full z-0'
        resizeMode='cover'
      />
      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        className='px-5'
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'center',
          gap: 16,
          marginVertical: 16
        }}
        contentContainerStyle={{
          paddingBottom: 100
        }}
        ListHeaderComponent={
          <>
            <View className='w-full flex-row items-center justify-center mt-20'>
              <Image source={icons.logo} className='w-12 h-10' />
            </View>
            <View className='my-5'>
              <SearchBar
                placeholder='Search for a movie...'
                value={searchTerm}
                onChangeText={(text: string) => setSearchTerm(text)}
              />
            </View>
            {
              loading && (
                <ActivityIndicator size='large' color='#0000ff' className='my-3' />
              )
            }
            {
              error && (
                <Text className='text-red-500 px-5 my-3'>
                  Error: {error.message}
                </Text>
              )
            }

            {
              !loading && !error && searchTerm.trim() && movies && movies.length > 0 && (
                <Text className='text-white text-lg font-bold mt-5 mb-3'>
                  Search Results for: {''}
                  <Text className='text-accent text-lg font-bold mt-5 mb-3'>
                    {searchTerm}
                    {/* SEARCH TERM */}
                  </Text>
                </Text>
              )
            }
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-10 px-5'>
              <Text className='text-center text-gray-500'>
                {searchTerm.trim() ? 'No movies found' : 'Search for a movie...'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default search