import { DocumentList } from "@/components/documents/document-list"

interface DocumentsPageProps {
  params: { tenant: string }
}

export default function DocumentsPage({ params }: DocumentsPageProps) {
  return <DocumentList tenant={params.tenant} />
}