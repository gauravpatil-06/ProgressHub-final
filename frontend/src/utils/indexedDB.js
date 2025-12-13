import { openDB } from 'idb';

const DB_NAME = 'ProgressHubDB';
const STORE_NAME = 'notes_and_files';
const DB_VERSION = 5;

export const initDB = async () => {
    return openDB(DB_NAME, DB_VERSION, {
        upgrade(db) {
            if (db.objectStoreNames.contains(STORE_NAME)) {
                db.deleteObjectStore(STORE_NAME);
            }
            // Create store WITHOUT keyPath to allow out-of-line keys (fileRef)
            db.createObjectStore(STORE_NAME);
        },
    });
};

export const saveFile = async (fileRef, fileData) => {
    if (!fileRef || !fileData) {
        console.error("Missing fileRef or fileData", { fileRef, fileData });
        return null;
    }

    try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.put(fileData, fileRef);
        await tx.done;
        console.log("Successfully saved file to IndexedDB:", fileRef);
        return fileRef;
    } catch (error) {
        console.error("IndexedDB saveFile error:", error);
        throw error;
    }
};

export const deleteFile = async (fileRef) => {
    if (!fileRef) return;
    try {
        const db = await initDB();
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        await store.delete(fileRef);
        await tx.done;
        console.log("Deleted file from IndexedDB:", fileRef);
    } catch (error) {
        console.error("IndexedDB deleteFile error:", error);
    }
};
