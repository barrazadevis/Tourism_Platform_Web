import { QuoteDetail } from "@/components/quotes/quote-detail"

interface QuoteDetailPageProps {
  params: { tenant: string; id: string }
}

export default function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  return <QuoteDetail tenant={params.tenant} quoteId={params.id} />
}

