import { getAdminToken } from '@/utils/adminStorage';

const authHeaders = () => {
    const token = getAdminToken();
    if (!token) return {};
    const formatted = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    return { Authorization: formatted };
};

export default authHeaders