import json

# Функция для удаления дублирующихся городов
def remove_duplicate_cities(json_file):
    # Загружаем данные из JSON-файла
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    # Проходим по каждой стране и удаляем дубли в списке городов
    for country in data["countries"]:
        unique_cities = list(set(country["cities"]))  # Удаляем дубли, преобразуя в множество, затем обратно в список
        unique_cities.sort()  # Опционально: сортируем города по алфавиту для удобства
        country["cities"] = unique_cities  # Обновляем список городов

    # Сохраняем обновленный JSON без дублей
    with open('eurasia_countries_and_cities_no_duplicates.json', 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("Дублирующиеся города удалены, данные сохранены в 'eurasia_countries_and_cities_no_duplicates.json'")

# Запуск функции
remove_duplicate_cities('eurasia_countries_and_cities_ru.json')
