import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      matricula: string
      lotacao: string
      cargo: string
      status: string
    }
  }

  interface User {
    matricula: string
    lotacao: string
    cargo: string
    status: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    matricula: string
    lotacao: string
    cargo: string
    status: string
  }
}
