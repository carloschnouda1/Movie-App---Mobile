import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { ActivityIndicator, FlatList, Image, Text, View } from "react-native";

export default function Index() {
  const router = useRouter();

  const {
    data: trendingMovies,
    error: trendingMoviesError,
    loading: trendingMoviesLoading
  } = useFetch(() => getTrendingMovies());

  const {
    data: movies,
    error: moviesError,
    loading: moviesLoading
  } = useFetch(() => fetchMovies({
    query: ''
  }));

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        resizeMode="cover"
      />
      {moviesLoading || trendingMoviesLoading ? (
        <View className="flex-1 items-center justify-center">
          <Image source={icons.logo} className="w-12 h-10 mb-5" />
          <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
        </View>
      ) : moviesError || trendingMoviesError ? (
        <View className="flex-1 items-center justify-center px-5">
          <Image source={icons.logo} className="w-12 h-10 mb-5" />
          <Text className="text-red-500">Error: {moviesError?.message || trendingMoviesError?.message}</Text>
        </View>
      ) : (
        <FlatList
          data={movies}
          renderItem={({ item }) => <MovieCard {...item} />}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            gap: 20,
            paddingRight: 5,
            marginBottom: 10,
          }}
          className="px-5"
          contentContainerStyle={{
            paddingBottom: 100
          }}
          ListHeaderComponent={
            <>
              <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto" />
              <View className="mt-5">
                <SearchBar
                  onPress={() => router.push("/search")}
                  placeholder="Search for a movie"
                />
                {
                  trendingMovies && trendingMovies.length > 0 && (
                   <View className="mt-10">
                    <Text className="text-white text-lg font-bold mb-3">Trending Movies</Text>
                    <FlatList
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      ItemSeparatorComponent={() => <View className="w-4" />}
                      data={trendingMovies}
                      renderItem={({ item, index }) => <TrendingCard movie={item} index={index} /> }
                      keyExtractor={(item) => item.movie_id.toString()}
                      />
                    </View>
                  )
                }
              </View>
              <Text className="text-white text-lg font-bold mt-5 mb-3">Latest Movies</Text>
            </>
          }
        />
      )}
    </View>
  );
}
