// In your Nuxt 3 code (e.g., in your store or a component file)
import { decryptData } from "./AES";

export const VUE_APP_API_URL = `${import.meta.env.VITE_API_URL}`;

// Encryption key
export const FRIED_CHICKEN = "&8^John$uperDuperCute2023!90degreesCelc1us&";

// Check if running in the client-side
export const IS_DEV = process.env.NODE_ENV !== 'production';

export const DEFAULT_BG = 'bg-emerald-900';

export const ROLE = async () => {
    const data = localStorage.getItem('ro-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
export const PERMISSION = () => {
    const data = localStorage.getItem('pe-001') ?? '000000';
    const decryptedData = decryptData(data);
    return decryptedData;
};
