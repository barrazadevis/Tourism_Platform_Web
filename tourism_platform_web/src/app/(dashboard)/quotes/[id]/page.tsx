import { QuoteDetail } from "@/components/quotes/quote-detail"

interface QuoteDetailPageProps {
  params: { id: string }
}

export default function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  return <QuoteDetail quoteId={params.id} />
}

