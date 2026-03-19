import axios from 'axios';

interface ApiCallParams {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
}

const useApiCall = () => {
    const makeApiCall = async ({ url, method, data = null }: ApiCallParams): Promise<[any, string | null]> => {
        try {
            const config = {
                url,
                method,
                data,
                withCredentials: true,
            };
            const response = await axios(config);
            return [response.data, null];
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'An error occurred';
            return [null, errorMsg];
        }
    };

    return { makeApiCall };
};

export default useApiCall;
