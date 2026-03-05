// Simple in-memory storage to pass large data between pages during a session
// This avoids localStorage quota limits for large files (images/PDFs)

type VyanaFile = {
    name: string;
    base64: string;
    mimeType: string;
}

class SessionStore {
    private store: Map<string, any> = new Map();

    set(key: string, value: any) {
        this.store.set(key, value);
    }

    get(key: string) {
        return this.store.get(key);
    }

    pop(key: string) {
        const val = this.store.get(key);
        this.store.delete(key);
        return val;
    }
}

export const sessionStore = new SessionStore();
