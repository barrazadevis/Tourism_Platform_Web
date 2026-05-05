import { QuoteDetail } from "@/components/quotes/quote-detail"

interface QuoteDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function QuoteDetailPage({ params }: QuoteDetailPageProps) {
  const resolvedParams = await params;
  return <QuoteDetail quoteId={resolvedParams.id} />
}

