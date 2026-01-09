import path from "path"
import fs from "fs"
import { SportType } from "@/types/sportType"
import { Sport } from "@/types/sport"
import { WeekDays } from "@/types/weekDays"
import { VenueDetails } from "@/types/venueDetails"


/**
 * Converts HH:MM to minutes since midnight
 * @param time The time to convert
 * @returns {number} Number of minutes from midnight
 */
const toMinutes = (time: string): number => {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + m;
};

/**
 * Loading games information in regard to the venues.
 * @returns {Promise<VenueDetails[]>} The venues information.
 */
export async function loadCSVData(): Promise<VenueDetails[]> {
    const venues: VenueDetails[] = await loadVenueCSV()

    const filePath = path.join(process.cwd(), "public", "venues.csv")
    const fileContents = fs.readFileSync(filePath, "utf-8").split("\n")

    const events = fileContents.map(row => row.replace(/(\r\n|\r)/gm, ""))
    const formatedEvents = events.map(row => row.split(","))
    // let events = fileContents.map(row => row.split(","))

    for (const element of formatedEvents.slice(1)) {
        const [venueName, sportType, day, startHour, endHour, pricePerHour, studentPrice] = element

        const sport: Sport = {
            day: day as WeekDays,
            sportType: sportType as SportType,
            startHour: toMinutes(startHour),
            endHour: toMinutes(endHour),
            pricePerHour: Number(pricePerHour),
            studentPrice: Number(studentPrice)

        }
        const venue = venues.find(e => e.venueName === venueName)

        if (venue) {
            if (!venue.sportsAvailable.includes(sportType as SportType))
                venue.sportsAvailable.push(sportType as SportType)
            venue.sports.push(sport)
        }
    }
    return venues
}

/**
 * Loading venue information from CSV.
 * @returns {Promise<VenueDetails[]>} The venues information.
 */
export async function loadVenueCSV(): Promise<VenueDetails[]> {
    const compInfo: VenueDetails[] = []
    const infoPath = path.join(process.cwd(), "public", "companyinfo.csv")
    const CompanyContents = fs.readFileSync(infoPath, "utf-8").split("\n")

    const companies = CompanyContents.map(row => row.split(","))

    for (const element of companies.slice(1)) {
        const [venueName, address, description, zipCode, city, imgPath, website] = element

        compInfo.push({
            venueName,
            address,
            description: description as string,
            zipCode,
            city,
            imgPath: imgPath.trimEnd(),
            sportsAvailable: [],
            sports: [],
            website: website,
        })
    }

    return compInfo;
}

/**
 * Loading venues that contain a specific game
 * @param venueName The venue name to be excluded
 * @param activity The activity to search for
 * @returns {Promise<VenueDetails[]>} The venues information.
 */
export async function getAlternatives(venueName: string, activity: SportType): Promise<VenueDetails[]> {
    const venues = await loadCSVData();

    const filteredVenues = venues
        .filter(v => v.venueName !== venueName && v.sportsAvailable.includes(activity))
        .map(({ sports, ...venue }) => {
            const minPrice = Math.min(...sports.filter(g => g.sportType === activity).map(g => g.pricePerHour));
            return {
                ...venue,
                sports: sports.filter(g => g.sportType === activity as SportType && g.pricePerHour === minPrice)
            }
        })

    return filteredVenues
}

/**
 * Get venue data based on name
 * @param venueName Venue name to search for
 * @returns {Promise<VenueDetails>} The venue information.
 */
export async function getVenueData(venueName: string): Promise<VenueDetails> {
    const venues = await loadCSVData()
    venueName = venueName.includes('%') ? venueName.replace(/%20/g, " ") : venueName
    const venue = venues.find(v => v.venueName === venueName)!
    return venue
}

/**
 * Get available avenues for a specific game.
 * @param activity The activity to search for.
 * @param weekDay The week day to search for.
 * @returns @returns {Promise<Record<WeekDays, VenueDetails[]>>} Available venues.
 */
export async function getGameVenues(activity: SportType, weekDay: WeekDays): Promise<VenueDetails[]> {
    const venues = await loadCSVData();

    return venues
        .filter(v => v.sportsAvailable.includes(activity))
        .map(({ sports, ...venue }) => {
            return {
                ...venue,
                sports: sports.filter(g => g.sportType === activity && g.day === weekDay)
            }
        })
        .filter(v => v.sports.length !== 0)
}

/**
 * Getting all unique available games.
 * @returns {Promise<Game[]>} Available games.
 */
export async function getAvailableGames(): Promise<SportType[]> {
    const venues = await loadCSVData();

    return [...new Set(venues.map(v => v.sportsAvailable).flat())];
}