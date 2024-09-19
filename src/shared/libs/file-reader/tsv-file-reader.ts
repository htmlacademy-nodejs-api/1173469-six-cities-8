import EventEmitter from 'node:events';
import { createReadStream } from 'node:fs';
import { Amenity, City, Offer, OfferType, User, UserType } from '../../types/index.js';
import { FileReader } from './index.js';

export class TSVFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(
    private readonly filename: string
  ) {
    super();
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
      rooms: Number.parseInt(rooms, 10),
      guests: Number.parseInt(guests, 10),
      price: Number.parseInt(price, 10),
      amenities: validAmenities, // Проверенные удобства
      user: this.parseUser(username, email, avatarPath, userType as keyof typeof UserType),
      commentCount: Number.parseInt(commentCount, 10),
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
      type: validUserType, // Приведение типа пользователя
    };
  }

  // Чтение файла
  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const completeRow = remainingData.slice(0, nextLinePosition + 1);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(completeRow);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
