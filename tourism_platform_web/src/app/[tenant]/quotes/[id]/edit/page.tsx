import { QuoteForm } from "@/components/quotes/quote-form"

interface EditQuotePageProps {
  params: { tenant: string; id: string }
}

export default function EditQuotePage({ params }: EditQuotePageProps) {
  return (
    <QuoteForm 
      tenant={params.tenant} 
      isEditing={true}
      quoteId={params.id}
    />
  )
}