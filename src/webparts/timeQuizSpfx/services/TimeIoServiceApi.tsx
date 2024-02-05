import axios from 'axios';

export const getDateApi = async () => {
    const apiUrl = 'https://timeapi.io/api/Conversion/DayOfTheWeek/2028-02-29';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a proxy to avoid CORS issues - Only for development purposes
    console.log('Executing load Data');
    try {
        const response = await axios.get(proxyUrl + apiUrl, {
            headers: {
                'Accept': 'application/json',
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

export const postDataApi = async (fromCityTimezone: string, cityTimeZone: string) => {
    const apiUrl = 'https://timeapi.io/api/Conversion/ConvertTimeZone';
    const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; // Use a proxy to avoid CORS issues - Only for development purposes
    console.log('Executing load Data2');

    const requestData = {
        fromTimeZone: fromCityTimezone,
        dateTime: '2024-02-02 11:00:00',
        toTimeZone: cityTimeZone,
        dstAmbiguity: '',
    };
    try {
        const response = await axios.post(proxyUrl + apiUrl, requestData, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
    }
};