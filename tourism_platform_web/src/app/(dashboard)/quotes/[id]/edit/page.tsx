import { QuoteForm } from "@/components/quotes/quote-form"

interface EditQuotePageProps {
  params: Promise<{ id: string }>
}

export default async function EditQuotePage({ params }: EditQuotePageProps) {
  const resolvedParams = await params;
  return (
    <QuoteForm
      isEditing={true}
      quoteId={resolvedParams.id}
    />
  )
}