/**
 * Define a singleton class in order to share data between classes
 */
export class SharedStorage {
    constructor() {
        if (!SharedStorage.instance) {
            this.storage = {}; // Initialize an object to hold shared data
            SharedStorage.instance = this;
        }
        return SharedStorage.instance;
    }

    /**
     * setItem - Set an item in the storage instance
     * @param {string} key - Name of item to store 
     * @param {*} value - Value of item to store
     */
    setItem(key, value) {
        this.storage[key] = value;
    }

    getItem(key, defaultValue = null) {
        return this.storage[key] != null ? this.storage[key] : defaultValue;
    }
}

// Ensure a property is not enumerable and writable
Object.defineProperty(SharedStorage, 'instance', {
    enumerable: false,
    writable: true
});