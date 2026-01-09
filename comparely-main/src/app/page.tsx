import { loadCSVData } from "@/app/lib/loadData"
import { SportType } from "@/types/sportType";
import Header from "@/components/ui/header";
import ActivityWeek from "@/components/ui/weekContent";
import { VenueDetails } from "@/types/venueDetails";
import { getAvailableGames } from "@/app/lib/loadData"

type Params = Promise<{ sport: SportType }>

export default async function Home({ searchParams }: { searchParams: Params }) {
  const sport = await (await searchParams).sport ?? SportType.Bowling
  const venuesData: VenueDetails[] = await loadCSVData()
  const availableGames: SportType[] = await getAvailableGames()

  return (
    <div>
      <Header game={sport} availableGames={availableGames} />
        <ActivityWeek activityParams={sport} WeeklyData={venuesData} />
    </div>
  )
}