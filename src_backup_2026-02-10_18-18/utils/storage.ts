export interface SaveMeta {
    teamName: string;
    date: string;
    seasonPh: string;
    timestamp: number;
}

const DB_NAME = 'BasketballManagerDB';
const STORE_NAME = 'saves';
const DB_VERSION = 1;

const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'slotId' });
            }
        };
    });
};

export const saveToDB = async (slotId: number, data: any, meta: SaveMeta): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);

        const record = {
            slotId,
            data,
            meta,
            updatedAt: new Date().toISOString()
        };

        const request = store.put(record);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

export const loadFromDB = async (slotId: number): Promise<{ data: any; meta: SaveMeta } | null> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.get(slotId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const result = request.result;
            resolve(result ? { data: result.data, meta: result.meta } : null);
        };
    });
};

export const deleteFromDB = async (slotId: number): Promise<void> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.delete(slotId);

        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve();
    });
};

export const listSaves = async (): Promise<{ [key: number]: SaveMeta | null }> => {
    const db = await initDB();
    return new Promise((resolve, reject) => {
        const transaction = db.transaction(STORE_NAME, 'readonly');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.getAll();

        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
            const results = request.result;
            const slots: { [key: number]: SaveMeta | null } = { 1: null, 2: null, 3: null };

            results.forEach((record: any) => {
                if (slots.hasOwnProperty(record.slotId)) {
                    slots[record.slotId] = record.meta;
                }
            });
            resolve(slots);
        };
    });
};
