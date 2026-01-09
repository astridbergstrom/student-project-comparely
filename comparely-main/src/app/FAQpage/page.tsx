import Header from "@/components/ui/header";
import { SportType } from "@/types/sportType";
import { getAvailableGames, loadCSVData } from "../lib/loadData";
import { VenueDetails } from "@/types/venueDetails";

export default async function FAQPage() {
    const sport = SportType.Bowling
    const venuesData: VenueDetails[] = await loadCSVData()
    const availableGames: SportType[] = await getAvailableGames()

    const faqs = [
        { question: <strong>What is Comparely?</strong>, answer: 'Comparely is a tool for comparing products and services.' },
        { question: <strong>Is Comparely free to use?</strong>, answer: 'Yes, Comparely is completely free to use.' },
        { question: <strong>When were prices last updated?</strong>, answer: 'The prices were last updated on 2025-04-24.' },
    ];

    return (
        <div>
            <Header game={sport} availableGames={availableGames} />

            <div className="m-10">
                <h1 className="text-4xl">Frequently Asked Questions</h1>
                <br />
                {faqs.map((faq, index) => (
                    <div key={index}>
                        <h3 className="pb-5">{faq.question}</h3>
                        <p className="pb-5">{faq.answer}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};