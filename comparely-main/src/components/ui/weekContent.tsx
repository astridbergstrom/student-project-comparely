'use client'
import { Sport } from "@/types/sport";
import { SportType } from "@/types/sportType";
import { VenueDetails } from "@/types/venueDetails";
import { WeekDays } from "@/types/weekDays";
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import Image from "next/image";
import Link from "next/link";
import { get } from "http";

const date = new Date();
let currentDay = 0;
let currentHour = date.getHours() + 2;

// Adjusting for midnight
if (currentHour < 5) {
    currentHour += 24;
    currentDay -= 1
}

function fillTimeBox(
    sport: Sport,
    hour: number,
    day: number,
    currentHour: number,
    currentDay: number,
    currentMinutes: number
): [string, boolean] {
    const {
        isOpen,
        fillPercent,
        passedPercent,
        isCurrentHour,
        openedInMiddle,
        closedInMiddle
    } = getHourStatus(sport, hour, day, currentHour, currentDay, currentMinutes);

    const defaultColor = '#dfeddf';

    let background = defaultColor;

    if (isCurrentHour && !isOpen) {
        background = getPartlyPassedGradient(fillPercent, 'notOpen', isCurrentHour);
    } else if (hour < currentHour && day == currentDay) {
        background = 'repeating-linear-gradient(45deg,#ffffff, #ffffff 2px,#cccccc 2px,#cccccc 4px';
    } else if (isOpen && isCurrentHour) {
        if (openedInMiddle) {
            background = getPartlyPassedGradient(fillPercent, 'openInMiddle', isCurrentHour);
        } else if (closedInMiddle) {
            background = getPartlyPassedGradient(fillPercent, 'closeInMiddle', isCurrentHour);
        } else {
            background = getPartlyPassedGradient(fillPercent, 'fullHour', isCurrentHour);
        }
    }
    return [background, isOpen];
}


export default function ActivityWeek({ activityParams, WeeklyData }: { activityParams: SportType, WeeklyData: VenueDetails[] }) {
    const sport = activityParams
    const fullWeek: WeekDays[] = getSortedWeek()

    const [showStudentPrices, setShowStudentPrices] = useState(false)

    return (
        <>
            <div className="fixed bottom-4 right-4 
            sm:sticky sm:top-36 sm:right-auto sm:bottom-auto 
            sm:ml-auto sm:mr-10 
            z-30 bg-white 
            px-4 py-3 sm:px-5 sm:py-6 
            mb-6 text-base sm:text-lg 
            w-fit flex items-center 
            shadow-md rounded-xl
            ">
                Student prices
                <Switch
                    className="ml-4 scale-125"
                    checked={showStudentPrices}
                    onCheckedChange={setShowStudentPrices}
                />
            </div>

            {/* <div className="flex flex-col"> */}
            {fullWeek.map((day, dayKey) => {
                const dailyData = getGameVenues(sport, day, WeeklyData)
                const hours = Array.from({ length: 19 }, (_, i) => i + 9)
                const isToday = currentDay === dayKey

                return (
                    <div key={dayKey} className="ml-2 mb-10 mr-2">
                        <h1 className="mt-10 sm:mt-2 ml-5 sm:ml-10">{currentDay == dayKey ? <span className="text-4xl mb-4 text-gray 800 underline decoration-red-500 decoration-2">{day}</span> : <span className="text-[clamp(1.5rem,4vw,2.5rem)] mb-4 text-gray 800">{day}</span>}</h1>
                        <div className="flex justify-center overflow-x-auto w-auto mx-10">
                            <table className="border-collapse table-fixed w-[1200px] sm:min-w-[800px] mb-10">
                                <thead className="bg-grey-50 sticky top-0 z-20">
                                    <tr>
                                        <th
                                            scope="col"
                                            className="sticky left-0 w-[100px] bg-gray-50 z-30 text-lg text-left px-4 py-3 font-semibold text-gray-700"
                                        >
                                        </th>
                                        {dailyData.map((venue, vKey) => (
                                            <th
                                                key={vKey}
                                                className={`text-center align-top px-2 py-3 font-medium text-gray-600`}
                                            >
                                                <div className="flex flex-col min-w-[80px] max-w-[100px]items-center">
                                                    <Link
                                                        href={venue.website}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-black-600 hover:underline flex flex-col items-center"
                                                    >
                                                        <div className="relative w-16 h-16 sm:w-24 sm:h-24 mb-1">
                                                            <Image
                                                                src={venue.imgPath}
                                                                alt=""
                                                                fill className="object-contain"
                                                            />
                                                        </div>
                                                        <span className="text-[8px] sm:text-lg text-gray-500 italic mt-1">
                                                            {venue.venueName.startsWith("O'Learys")
                                                                ? venue.venueName.slice(9, 50)
                                                                : venue.venueName}
                                                            {venue.venueName === "Interpool" ? '*Price per person' : ""}
                                                        </span>
                                                    </Link>
                                                </div>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {hours.map((h, hIdx) => {
                                        const displayHour = h > 23 ? (h - 24).toString().padStart(2, '0') : h.toString().padStart(2, '0')
                                        const isCurrentHour = h === currentHour && isToday

                                        return (
                                            <tr key={h} className=" border border-gray-300" >
                                                <td className={`w-[100px] sticky left-0 bg-gray-50 px-4 py-2 font-semibold text-gray-700 ${isCurrentHour ? 'underline decoration-red-500 decoration-2' : ''
                                                    }`}>
                                                    {displayHour}:00
                                                </td>
                                                {dailyData.map((venue, vKey) => {
                                                    const matchingSport = venue.sports.find((s) => {
                                                        const [_, isMatch] = fillTimeBox(s, h, dayKey, currentHour, currentDay, date.getMinutes())
                                                        return isMatch;
                                                    })

                                                    const background = matchingSport ?
                                                        fillTimeBox(matchingSport, h, dayKey, currentHour, currentDay, date.getMinutes())[0] :
                                                        h < currentHour && dayKey == currentDay ? 'repeating-linear-gradient(45deg,#ffffff,#ffffff 2px,#cccccc 2px,#cccccc 4px)' :
                                                            h == currentHour && dayKey == currentDay ? getPartlyPassedGradient(0, 'notOpen', isCurrentHour) : '#f5f5f5';

                                                    return (
                                                        <td
                                                            key={vKey}
                                                            className="h-8 text-sm text-center text-gray-700 border-gray-300 border px-1 "
                                                            style={{ background }}
                                                        >
                                                            {matchingSport ? (
                                                                showStudentPrices && matchingSport.studentPrice
                                                                    ? `${matchingSport.studentPrice}:-/h (student)`
                                                                    : `${matchingSport.pricePerHour}:-/h`
                                                            ) : ''}
                                                            {matchingSport && venue.venueName === "Interpool" ? '*' : ''}
                                                        </td>
                                                    )
                                                })}
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div >
                )
            })}
            {/* </div> */}
        </>
    )
}

function getPartlyPassedGradient(
    fillPercent: number,
    open: 'openInMiddle' | 'closeInMiddle' | 'fullHour' | 'notOpen', isCurrentHour: boolean): string {

    const lineColor = '#FF0000';
    const defaultColor = '#f5f5f5';
    const openColor = '#dfeddf';

    const elapsedPercent = (date.getMinutes() / 60) * 100;
    const redStart = elapsedPercent - 2;
    const redEnd = elapsedPercent + 2;
    const fillStart = redEnd;

    const gradients: Record<string, string> = {
        'fullHour': `linear-gradient(to bottom, 
            ${openColor} 0%, 
            ${openColor} ${elapsedPercent}%,
            ${lineColor} ${redStart}%,
            ${lineColor} ${redEnd}%,
            ${openColor} ${fillStart}%,
            ${openColor} 100%)`,

        'notOpen': `linear-gradient(to bottom, 
            ${defaultColor} 0%, 
            ${defaultColor} ${elapsedPercent}%,
            ${lineColor} ${redStart}%,
            ${lineColor} ${redEnd}%,
            ${defaultColor} ${fillStart}%,
            ${defaultColor} 100%)`,

        'openInMiddle': `linear-gradient(${open}, 
            ${defaultColor} 0%, 
            ${defaultColor} ${elapsedPercent}%,
            ${lineColor} ${redStart}%,
            ${lineColor} ${redEnd}%,
            ${openColor} ${fillStart}%,
            ${openColor} 100%)`,

        'closeInMiddle': `linear-gradient(${open}, 
            ${openColor} 0%, 
            ${openColor} ${elapsedPercent}%,
            ${lineColor} ${redStart}%,
            ${lineColor} ${redEnd}%,
            ${defaultColor} ${fillStart}%,
            ${defaultColor} 100%)`
    };

    if (open === 'fullHour') return gradients['fullHour'];
    if (open === 'notOpen') return gradients['notOpen'];
    if (open === 'openInMiddle') return gradients['openInMiddle'];
    if (open === 'closeInMiddle') return gradients['closeInMiddle'];
    return gradients['default'];
}

function getHourStatus(sport: Sport, hour: number, day: number, currentHour: number, currentDay: number, currentMinutes: number): {
    isOpen: boolean,
    fillPercent: number,
    passedPercent: number,
    isCurrentHour: boolean,
    openedInMiddle: boolean,
    closedInMiddle: boolean,
} {
    let closeMin = sport.endHour;
    const openMin = sport.startHour;

    if (closeMin <= openMin) closeMin += 1440;

    const hourStart = hour * 60;
    const hourEnd = hourStart + 60;
    const overlapStart = Math.max(openMin, hourStart);
    const overlapEnd = Math.min(closeMin, hourEnd);

    const minutesOpen = overlapEnd - overlapStart;
    const fillPercent = (minutesOpen / 60) * 100;
    const passedPercent = (currentMinutes / 60) * 100;

    const isOpen = minutesOpen > 0;
    const isCurrentHour = (hourStart === currentHour * 60 && day === currentDay);

    const openedInMiddle = openMin >= hourStart && openMin < hourEnd && minutesOpen < 60;
    const closedInMiddle = closeMin > hourStart && closeMin <= hourEnd && minutesOpen < 60;

    return {
        isOpen,
        fillPercent,
        passedPercent,
        isCurrentHour,
        openedInMiddle,
        closedInMiddle
    };
}


function getGameVenues(activity: SportType, weekDay: WeekDays, venueDetails: VenueDetails[]): VenueDetails[] {

    return venueDetails
        .filter(v => v.sportsAvailable.includes(activity))
        .map(({ sports, ...venue }) => ({
            ...venue,
            sports: sports.filter(g => g.sportType === activity && g.day === weekDay)
        }))
        .filter(v => v.sports.length > 0)
}

function getSortedWeek(): WeekDays[] {
    const fullWeek: WeekDays[] = Object.values(WeekDays)
    const before = fullWeek.slice(date.getDay())
    const after = fullWeek.slice(0, date.getDay())
    return before.concat(after)
}
