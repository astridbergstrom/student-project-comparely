import { SportType } from "./sportType";
import { WeekDays } from "./weekDays";

export interface Sport {
    day: WeekDays,
    sportType: SportType,
    startHour: number,
    endHour: number,
    pricePerHour: number;
    studentPrice: number | undefined
}