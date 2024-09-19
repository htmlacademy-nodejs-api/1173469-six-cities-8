import { Amenity, City, Coordinates, OfferType, User } from './index.js';

export type Offer = {
  title: string; // 10 - 100 символов
  description: string; // 20 - 1024 символов
  postDate: Date;
  city: City;
  previewImage: string;
  images: string[]; // Список фотографий (6 изображений)
  isPremium: boolean;
  isFavorite: boolean;
  rating: number; // 1 - 5 Допускаются числа с запятой (1 знак после запятой)
  type: OfferType;
  rooms: number; // 1 - 8
  guests: number; // 1 - 10
  price: number; // 100 - 100 000
  amenities: Amenity[];
  user: User;
  commentCount: number; // Количество комментариев, рассчитывается автоматически
  location: Coordinates;
};
