import { Sport } from "./sport";
import { SportType } from "./sportType";

export interface VenueDetails {
    venueName: string;
    address: string;
    description: string;
    zipCode: string;
    city: string;
    imgPath: string;
    sportsAvailable: SportType[];
    sports: Sport[];
    website: string;
}