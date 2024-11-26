// MainPage.tsx
import React from 'react';

const MainPage = () => {
    return (
        <>
            <div className="content">
                <div className="image-container">
                    <div className="image"></div>
                    <div className="overlay-text">
                        <p><b>Cargo Booking</b> — это инновационная платформа для бронирования грузов, созданная, чтобы упростить взаимодействие между грузоотправителями и водителями. Сайт предоставляет удобные и быстрые инструменты для поиска и бронирования грузов, а также для управления перевозками. <b>Cargo Booking</b> объединяет заказчиков, которые хотят отправить груз, и профессиональных водителей, готовых взять его на доставку, предлагая максимально эффективный и прозрачный процесс.</p>
                    </div>
                </div>
            </div>

            {/* Переместите circle-images-container вне content */}
            <div className="circle-images-container">
                {/* Ваши круговые изображения */}
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 1</p>
                </div>
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 2</p>
                </div>
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 3</p>
                </div>
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 4</p>
                </div>
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 5</p>
                </div>
                <div className="circle-image-wrapper">
                    <div className="circle-image" style={{ backgroundColor: 'red', width: '80px', height: '80px', borderRadius: '50%' }}></div>
                    <p className="circle-caption">Caption 6</p>
                </div>
                {/* Остальные кружки */}
            </div>
        </>
    );
};

export default MainPage;
