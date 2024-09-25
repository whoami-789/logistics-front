import React, { useState } from 'react';

const TripsPage: React.FC = () => {
  const [tripType, setTripType] = useState<string>('');
  const [cargoType, setCargoType] = useState<string>('');
  const [volume, setVolume] = useState<number | string>('');
  const [currency, setCurrency] = useState<string>('USD');
  const [paymentMethod, setPaymentMethod] = useState<string>('');
  const [advancePayment, setAdvancePayment] = useState<number>(0);

  return (
    <div>
      <h2>Создать новый груз</h2>
      <form>
        <label>Тип работы</label>
        <select value={tripType} onChange={(e) => setTripType(e.target.value)}>
          <option value="one-way">Односторонняя поездка</option>
          <option value="round-trip">Туда и обратно</option>
          <option value="multi-stop">Многостоповая поездка</option>
        </select>
        
        {/* Другие поля формы аналогично */}

        <label>Способ оплаты</label>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="cash">Наличные</option>
          <option value="transfer">Перечисление</option>
        </select>

        <label>Аванс (%)</label>
        <input type="number" value={advancePayment} onChange={(e) => setAdvancePayment(Number(e.target.value))} />

        <button type="submit">Создать груз</button>
      </form>
    </div>
  );
}

export default TripsPage;
