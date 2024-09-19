import { Amenity, City, Coordinates, OfferType, User } from './index.js';

export type MockServerData = {
  cities: City[];
  coordinates: Record<City, Coordinates>;
  offerTypes: OfferType[];
  titles: string[];
  descriptions: string[];
  previewImages: string[];
  images: string[];
  amenities: Amenity[];
  users: User[];
};
