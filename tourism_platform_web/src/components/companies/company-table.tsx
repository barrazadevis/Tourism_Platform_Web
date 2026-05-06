import { Company } from "@/types/company"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit, CheckCircle, XCircle } from "lucide-react"

interface CompanyTableProps {
  companies: Company[];
  onEdit: (company: Company) => void;
  onToggleStatus: (company: Company) => void;
}

export function CompanyTable({ companies, onEdit, onToggleStatus }: CompanyTableProps) {
  return (
    <div className="rounded-md border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Usuarios</TableHead>
            <TableHead>Aplicación</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {companies.map((company) => (
            <TableRow key={company.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium text-foreground">{company.name}</TableCell>
              <TableCell>{company.planType}</TableCell>
              <TableCell>
                <Badge variant={company.isActive ? "default" : "destructive"} className={company.isActive ? "bg-success" : ""}>
                  {company.isActive ? "Activa" : "Inactiva"}
                </Badge>
              </TableCell>
              <TableCell>{company.subscriptionEndsAt ? new Date(company.subscriptionEndsAt).toLocaleDateString(undefined, { timeZone: 'UTC' }) : 'N/A'}</TableCell>
              <TableCell>{company.usersCount}</TableCell>
              <TableCell>{company.applicationName || company.applicationId}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => onEdit(company)} className="text-primary hover:text-primary hover:bg-primary/10">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => onToggleStatus(company)}
                    className={company.isActive ? "text-destructive hover:text-destructive hover:bg-destructive/10" : "text-success hover:text-success hover:bg-success/10"}
                  >
                    {company.isActive ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {companies.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No se encontraron compañías.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
