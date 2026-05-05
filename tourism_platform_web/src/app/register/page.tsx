import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
      <div className="absolute inset-0 bg-[url('/travel-bg.jpg')] bg-cover bg-center opacity-10" />
      <div className="relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">TourismPro</h1>
          <p className="text-gray-600">Plataforma de gestión turística</p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
}