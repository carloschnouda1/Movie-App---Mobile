import type { Models } from "react-native-appwrite";
import { Account, Client, Databases, ID, Query } from "react-native-appwrite";

import "react-native-url-polyfill/auto";

//track the searches made by the user
const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const PROJECT_ID = process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!;
const ENDPOINT = process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!.replace(/\/$/, "");

export const appwriteClient = new Client()
    .setEndpoint(ENDPOINT)
    .setProject(PROJECT_ID);


const database = new Databases(appwriteClient);
const account = new Account(appwriteClient);

export const getAccount = () => account;
export const getDatabase = () => database;

export const registerWithEmail = async ({
    email,
    password,
    confirmPassword,
    name,
}: {
    email: string;
    password: string;
    confirmPassword: string;
    name?: string;
}): Promise<Models.User<Models.Preferences>> => {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    if (password !== confirmPassword) {
        throw new Error("Passwords do not match.");
    }

    const user = await account.create(ID.unique(), email, password, name);

    await account.createEmailPasswordSession(email, password);

    return user;
};

export const loginWithEmail = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    if (!email || !password) {
        throw new Error("Email and password are required.");
    }

    return account.createEmailPasswordSession(email, password);
};

export const createSessionFromOAuthSecret = async ({
    userId,
    secret,
}: {
    userId: string;
    secret: string;
}) => {
    if (!userId || !secret) {
        throw new Error("OAuth credentials missing.");
    }

    return account.createSession(userId, secret);
};

export const getCurrentUser = async (): Promise<Models.User<Models.Preferences> | null> => {
    try {
        return await account.get();
    } catch (error) {
        console.warn("Unable to fetch current user", error);
        return null;
    }
};

export const getCurrentSession = async () => {
    try {
        return await account.getSession("current");
    } catch (error) {
        console.warn("Unable to fetch current session", error);
        return null;
    }
};

export const logoutCurrentSession = async () => {
    try {
        await account.deleteSession("current");
    } catch (error) {
        console.warn("Unable to logout current session", error);
        throw error;
    }
};

export const getOAuthLoginUrl = ({
    provider,
    success,
    failure,
    scopes = [],
}: {
    provider: string;
    success: string;
    failure: string;
    scopes?: string[];
}) => {
    const params = new URLSearchParams({
        project: PROJECT_ID,
        success,
        failure,
    });

    scopes.forEach((scope) => {
        params.append("scopes[]", scope);
    });

    return `${ENDPOINT}/account/sessions/oauth2/${provider}?${params.toString()}`;
};

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