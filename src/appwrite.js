// src/appwrite.js
import { Client, Account, Databases, TablesDB, Storage, ID, Query } from 'appwrite';

const client = new Client();

client
    .setEndpoint(process.env.REACT_APP_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.REACT_APP_APPWRITE_PROJECT_ID);

// Initialize services
const account = new Account(client);
const databases = new Databases(client);
const tablesDB = new TablesDB(client);
const storage = new Storage(client);

// Configuration constants
const DATABASE_ID = process.env.REACT_APP_APPWRITE_DATABASE_ID;
const STORAGE_BUCKET_ID = process.env.REACT_APP_APPWRITE_STORAGE_BUCKET_ID;

// Collections
const COLLECTIONS = {
    WHISKIES: 'whiskies',
    DISTILLERIES: 'distilleries', 
    REGIONS: 'regions',
    SERIES: 'series',
    BOTTLERS: 'bottlers'
};

// Database operations
const addWhisky = async (whisky) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            COLLECTIONS.WHISKIES,
            ID.unique(),
            whisky
        );
        return response;
    } catch (error) {
        console.error("Error adding whisky: ", error);
        throw error;
    }
};

const fetchDistilleries = async (region = undefined) => {
    try {
        let queries = [];
        if (region) {
            queries.push(Query.equal('region', region));
        }
        
        const response = await databases.listDocuments(
            DATABASE_ID,
            COLLECTIONS.DISTILLERIES,
            queries
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc }));
    } catch (error) {
        console.error("Error fetching distilleries: ", error);
        throw error;
    }
};

const fetchCollection = async (collectionName) => {
    try {
        const response = await databases.listDocuments(
            DATABASE_ID,
            collectionName
        );
        return response.documents.map(doc => ({ id: doc.$id, ...doc }));
    } catch (error) {
        console.error(`Error fetching ${collectionName}: `, error);
        throw error;
    }
};

const getDocument = async (collectionName, documentId) => {
    try {
        const response = await databases.getDocument(
            DATABASE_ID,
            collectionName,
            documentId
        );
        return { id: response.$id, ...response };
    } catch (error) {
        console.error(`Error fetching document: `, error);
        throw error;
    }
};

const updateDocument = async (collectionName, documentId, data) => {
    try {
        const response = await databases.updateDocument(
            DATABASE_ID,
            collectionName,
            documentId,
            data
        );
        return { id: response.$id, ...response };
    } catch (error) {
        console.error(`Error updating document: `, error);
        throw error;
    }
};

const deleteDocument = async (collectionName, documentId) => {
    try {
        await databases.deleteDocument(
            DATABASE_ID,
            collectionName,
            documentId
        );
    } catch (error) {
        console.error(`Error deleting document: `, error);
        throw error;
    }
};

const createDocument = async (collectionName, documentId, data) => {
    try {
        const response = await databases.createDocument(
            DATABASE_ID,
            collectionName,
            documentId,
            data
        );
        return { id: response.$id, ...response };
    } catch (error) {
        console.error(`Error creating document: `, error);
        throw error;
    }
};

// Storage operations
const uploadFile = async (file) => {
    try {
        const response = await storage.createFile(
            STORAGE_BUCKET_ID,
            ID.unique(),
            file
        );
        return response;
    } catch (error) {
        console.error("Error uploading file: ", error);
        throw error;
    }
};

const getFileUrl = (fileId) => {
    return storage.getFileView(STORAGE_BUCKET_ID, fileId);
};

const deleteFile = async (fileId) => {
    try {
        await storage.deleteFile(STORAGE_BUCKET_ID, fileId);
    } catch (error) {
        console.error("Error deleting file: ", error);
        throw error;
    }
};

export { 
    client, 
    account, 
    databases, 
    tablesDB,
    storage,
    DATABASE_ID,
    STORAGE_BUCKET_ID,
    COLLECTIONS,
    addWhisky,
    fetchDistilleries,
    fetchCollection,
    getDocument,
    updateDocument,
    deleteDocument,
    createDocument,
    uploadFile,
    getFileUrl,
    deleteFile,
    Query,
    ID
};