import { QuoteList } from "@/components/quotes/quote-list"

interface QuotesPageProps {
  params: { tenant: string }
}

export default function QuotesPage({ params }: QuotesPageProps) {
  return <QuoteList tenant={params.tenant} />
}