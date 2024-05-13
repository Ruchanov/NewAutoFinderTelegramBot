import { Car } from '../../domains/scraper/scraper';

export function stringifyCar(car: Car): string {
  const clearanceKZString = car.clearanceKZ ? 'Да' : 'Нет';
  const formattedPrice = car.price.toLocaleString('ru-RU') + ' тг';
  const mileageString = car.mileage !== null
  ? car.mileage?.toLocaleString('ru-RU') + ' км'
  : 'Не указан';
  let priceComparison: string;
  if (car.percentDifference === 0) {
    priceComparison = 'Равна средней цене по этой модели';
  } else if (car.percentDifference > 0) {
    priceComparison = `Дороже на ${car.percentDifference.toFixed(2)}% похожих`;
  } else {
    priceComparison = `Дешевле на ${Math.abs(car.percentDifference).toFixed(2)}% похожих`;
  }

    return ` Детали машины:
ID: ${car.id}
Модель: ${car.name}
Кузов: ${car.body}
Город: ${car.city}
Растаможен в Казахстане: ${clearanceKZString}
Привод: ${car.drive}
Пробег: ${mileageString} 
Цена: ${formattedPrice}
Объем: ${car.volume} л
${priceComparison}
Ссылка: https://kolesa.kz/a/show/${car.id}
`;
}
