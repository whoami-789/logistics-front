import React, { useEffect, useRef, useState } from 'react';
import { YMaps, Map, Placemark } from '@pbe/react-yandex-maps';

interface YandexMapProps {
    onAddressSelect: (address: string) => void; // Функция для возврата выбранного адреса
    initialCoords: [number, number] | null; // Добавьте prop для координат
}

const YandexMap: React.FC<YandexMapProps> = ({ onAddressSelect, initialCoords }) => {
    const mapRef = useRef<any>(null);
    const placemarkRef = useRef<any>(null);

    const [currentCoords, setCurrentCoords] = useState<[number, number]>(initialCoords || [55.751574, 37.573856]);

    useEffect(() => {
        if (initialCoords) {
            setCurrentCoords(initialCoords);
        }
    }, [initialCoords]);

    const handleMapClick = (event: any) => {
        const coords = event.get('coords');
        setCurrentCoords(coords);
        
        // Здесь вы можете использовать API Яндекс.Карт для обратного геокодирования
        onAddressSelect(`Адрес по координатам: ${coords[0]}, ${coords[1]}`);
    };

    return (
        <YMaps>
            <Map
                instanceRef={mapRef}
                defaultState={{ center: currentCoords, zoom: 9 }} // Центр и масштаб карты
                style={{ width: '100%', height: '400px' }}
                onClick={handleMapClick}
            >
                <Placemark
                    instanceRef={placemarkRef}
                    geometry={currentCoords}
                    properties={{ balloonContent: 'Выберите адрес' }}
                />
            </Map>
        </YMaps>
    );
};

export default YandexMap;
