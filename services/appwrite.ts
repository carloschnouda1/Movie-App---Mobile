import { Client, Databases, ID, Query } from "react-native-appwrite";
//track the searches made by the user
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)


const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {

        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("searchTerm", query)]);

        // check if a record of that search has already been stored 
        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id, {
                count: existingMovie.count + 1
            });
        } else {
            await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
                searchTerm: query,
                movie_id: movie.id,
                title: movie.title,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                count: 1
            });
        }
    }
    catch (error) {
        console.error(error);
        throw error;
    }
    // console.log(result);
    //if a document is found increment the searchCount field
    //if a document is not found create a new document with the search term and the movie id
}

export const getTrendingMovies = async (): Promise<TrendingMovie[]> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(5),
            Query.orderDesc("count")
        ]);

        return result.documents as unknown as TrendingMovie[];
    }
    catch (error) {
        console.error(error);
        throw error;
    }
}