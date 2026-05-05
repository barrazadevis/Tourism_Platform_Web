import { QuoteForm } from "@/components/quotes/quote-form"

interface EditQuotePageProps {
  params: { id: string }
}

export default function EditQuotePage({ params }: EditQuotePageProps) {
  return (
    <QuoteForm
      isEditing={true}
      quoteId={params.id}
    />
  )
}