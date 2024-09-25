import React from 'react';

interface Cargo {
  id: number;
  status: string;
  from: string;
  to: string;
  date: string;
}

const HistoryPage: React.FC = () => {
  const cargoHistory: Cargo[] = [
    { id: 1, status: 'Завершено', from: 'Москва', to: 'Питер', date: '2023-09-15' },
    { id: 2, status: 'В пути', from: 'Казань', to: 'Уфа', date: '2023-09-20' }
  ];

  return (
    <div>
      <h2>История грузов</h2>
      <ul>
        {cargoHistory.map((cargo) => (
          <li key={cargo.id}>
            {cargo.from} - {cargo.to}, статус: {cargo.status}, дата: {cargo.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HistoryPage;
