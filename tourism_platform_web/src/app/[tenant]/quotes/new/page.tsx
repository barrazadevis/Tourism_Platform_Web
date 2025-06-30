import { QuoteForm } from "@/components/quotes/quote-form"

interface NewQuotePageProps {
  params: { tenant: string }
}

export default function NewQuotePage({ params }: NewQuotePageProps) {
  return <QuoteForm tenant={params.tenant} />
}