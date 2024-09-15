import { readFileSync } from 'node:fs';
import { Amenity, City, Offer, OfferType, User, UserType } from '../../types/index.js';
import { FileReader } from './index.js';

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  private validateRawData(): void {
    if (! this.rawData) {
      throw new Error('File was not read');
    }
  }

  // Основной метод для чтения данных из TSV и преобразования их в массив Offer
  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  // Парсинг одной строки файла TSV в объект типа Offer
  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      postDate,
      city,
      previewImage,
      images,
      isPremium,
      isFavorite,
      rating,
      type,
      rooms,
      guests,
      price,
      amenities,
      username,
      email,
      avatarPath,
      userType,
      commentCount,
      location
    ] = line.split('\t');

    const [latitude, longitude] = location.split(',').map(Number);

    // Проверка на валидность типа жилья
    const offerType = Object.values(OfferType).includes(type as OfferType)
      ? type as OfferType
      : (() => {
        throw new Error(`Invalid OfferType: ${type}`);
      })();

    // Проверка на валидность города
    const cityValue = Object.values(City).includes(city as City)
      ? city as City
      : (() => {
        throw new Error(`Invalid City: ${city}`);
      })();

    // Проверка на валидность удобств
    const validAmenities = this.parseAmenities(amenities).filter((amenity) => {
      if (!Object.values(Amenity).includes(amenity)) {
        console.error(`Invalid Amenity: ${amenity}`);
        return false;
      }
      return true;
    });

    return {
      title,
      description,
      postDate: new Date(postDate),
      city: cityValue, // Приведение города
      previewImage,
      images: images.split(';'),
      isPremium: isPremium === 'true',
      isFavorite: isFavorite === 'true',
      rating: Number(rating),
      type: offerType, // Приведение типа жилья
      rooms: Number(rooms),
      guests: Number(guests),
      price: Number(price),
      amenities: validAmenities, // Проверенные удобства
      user: this.parseUser(username, email, avatarPath, userType as keyof typeof UserType),
      commentCount: Number(commentCount),
      location: { latitude, longitude },
    };
  }

  // Парсинг удобств (amenities) из строки
  private parseAmenities(amenitiesString: string): Amenity[] {
    return amenitiesString.split(';') as Amenity[];
  }

  // Парсинг пользователя
  private parseUser(name: string, email: string, avatarPath: string, userType: string): User {
    const validUserType = Object.values(UserType).includes(userType as UserType)
      ? userType as UserType
      : (() => {
        throw new Error(`Invalid UserType: ${userType}`);
      })();

    return {
      name,
      email,
      avatarPath,
      password: '', // Пароль не хранится в TSV
      type: validUserType, // Приведение типа пользователя
    };
  }

  // Чтение файла
  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  // Преобразование прочитанных данных в массив объектов
  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
