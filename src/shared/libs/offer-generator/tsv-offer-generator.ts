import dayjs from 'dayjs';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';
import { Coordinates, MockServerData } from '../../types/index.js';

const MIN_PRICE = 100;
const MAX_PRICE = 100000;
const MIN_ROOMS = 1;
const MAX_ROOMS = 8;
const MIN_GUESTS = 1;
const MAX_GUESTS = 10;
const MIN_RATING = 1;
const MAX_RATING = 5;
const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 100;
const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

export class TSVOfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const coordinates: Coordinates = this.mockData.coordinates[city];
    const previewImage = getRandomItem(this.mockData.previewImages);

    // Используем getRandomItems для получения нескольких изображений
    const images = getRandomItems(this.mockData.images).join(';');

    const isPremium = Math.random() > 0.5;
    const isFavorite = Math.random() > 0.5;
    const rating = generateRandomValue(MIN_RATING, MAX_RATING, 1);
    const type = getRandomItem(this.mockData.offerTypes);
    const rooms = generateRandomValue(MIN_ROOMS, MAX_ROOMS).toString();
    const guests = generateRandomValue(MIN_GUESTS, MAX_GUESTS).toString();
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE).toString();

    // Используем getRandomItems для выбора нескольких удобств
    const amenities = getRandomItems(this.mockData.amenities).join(';');

    const user = getRandomItem(this.mockData.users);
    const commentCount = generateRandomValue(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT).toString();

    const createdDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    // Формирование TSV строки
    return [
      title,
      description,
      createdDate,
      city,
      previewImage,
      images,
      isPremium.toString(),
      isFavorite.toString(),
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      user.name,
      user.email,
      user.avatarPath ?? '',
      user.type,
      commentCount,
      `${coordinates.latitude},${coordinates.longitude}`
    ].join('\t');
  }
}
