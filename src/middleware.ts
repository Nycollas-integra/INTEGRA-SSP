import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Adicionar lógica adicional de middleware se necessário
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Permitir acesso se o usuário estiver autenticado
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/protected/:path*"
  ]
}
