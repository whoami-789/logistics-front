import React, { useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark, SearchControl, GeolocationControl } from '@pbe/react-yandex-maps';

interface YandexMapProps {
    onAddressSelect: (address: string) => void; // Функция для возврата выбранного адреса
    initialCoords: [number, number] | null; // Добавьте prop для координат
}

const YandexMap: React.FC<YandexMapProps> = ({ onAddressSelect, initialCoords }) => {
    const [currentCoords, setCurrentCoords] = useState<[number, number]>(initialCoords || [55.751244, 37.618423]);

    useEffect(() => {
        // Если новые initialCoords пришли, обновляем карту
        if (initialCoords) {
            setCurrentCoords(initialCoords);
        }
    }, [initialCoords]);

    const handleMapClick = async (event: any) => {
        const coords = event.get('coords');
        setCurrentCoords(coords); // обновляем состояние маркера

        // Используем обратное геокодирование для получения адреса
        const address = await getAddressFromCoords(coords);
        onAddressSelect(address); // передаем адрес в TripsPage
    };

    const handleResultSelect = async (event: any) => {
        const index = event.get('index');
        const results = event.get('results');
        const selectedResult = results[index];

        if (selectedResult) {
            const coords = selectedResult.geometry.getCoordinates();
            setCurrentCoords(coords); // обновляем состояние маркера
            const address = await getAddressFromCoords(coords);
            onAddressSelect(address); // передаем адрес
        }
    };

    return (
        <YMaps query={{ apikey: 'a0182201-d5b3-4c80-8a64-9ac085a73d3d' }}>
            <Map
                state={{ center: currentCoords, zoom: 17 }}
                style={{ width: '100%', height: '400px' }}
                onClick={handleMapClick}
            >

                <Placemark geometry={currentCoords} />
            </Map>
        </YMaps>
    );
};

const getAddressFromCoords = async (coords: [number, number]) => {
    const apiKey = 'a0182201-d5b3-4c80-8a64-9ac085a73d3d';
    const response = await fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=${apiKey}&geocode=${coords[1]},${coords[0]}&format=json`);
    const data = await response.json();

    if (data && data.response && data.response.GeoObjectCollection && data.response.GeoObjectCollection.featureMember.length > 0) {
        const geoObject = data.response.GeoObjectCollection.featureMember[0].GeoObject;

        // Получаем улицу и дом (name) и город со страной (description)
        const streetAddress = geoObject.name;  // "Levi Boboxonov ko'chasi, 8"
        const cityCountry = geoObject.description;  // "Бухара, Узбекистан"

        // Составляем полный адрес
        const fullAddress = `${streetAddress}, ${cityCountry}`;

        return fullAddress;
    }

    return 'Адрес не найден';
};




export default YandexMap;
