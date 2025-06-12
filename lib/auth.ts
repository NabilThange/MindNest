import { supabase } from "./supabase"
import { DatabaseService } from "./database-service"
import { mapUserYearToSemesters } from "./semester-utils"

export interface User {
  id: string
  email: string
  prn?: string
  fullName: string
  college_id?: string
  program_id?: string
  current_semester?: number
  profile_completed?: boolean
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  isLoading: boolean
}

export interface SignupData {
  fullName: string
  age: string
  location: string
  collegeName: string
  rollNumber: string
  yearOfStudy: string
  faculty: string
  department: string
  coreSubject?: string
  electivePhysics?: string
  electiveChemistry?: string
  preferredLanguages: string[]
  learningStyle: string
  visualNotes: string
  studyPreference: string
  studyFrequency: string
  examReminders: string
  entranceExams: string[]
  peerNotes: string
  studyPlans: string
  backlogs: string
  weakSubjects: string[]
  currentTools: string[]
}

class AuthService {
  async login(prn: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // For demo purposes - handle test credentials
      if (prn === "test" && password === "test") {
        // Create a demo user session
        const demoUser: User = {
          id: "demo-user-123",
          email: "test@student.mu.ac.in",
          prn: "test",
          fullName: "Demo Student",
          college_id: "demo-college",
          program_id: "demo-program",
          current_semester: 3,
          profile_completed: true,
        }

        // Store in localStorage for demo
        localStorage.setItem("auth_user", JSON.stringify(demoUser))
        localStorage.setItem("auth_token", "demo_token_123")

        return { success: true, user: demoUser }
      }

      // For real authentication, use email format
      const email = `${prn}@student.mu.ac.in`

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
        // Get user profile from database
        const userProfile = await DatabaseService.getUserByEmail(data.user.email!)

        if (userProfile) {
          const user: User = {
            id: userProfile.id,
            email: userProfile.email,
            prn: userProfile.prn || undefined,
            fullName: userProfile.full_name,
            college_id: userProfile.college_id || undefined,
            program_id: userProfile.program_id || undefined,
            current_semester: userProfile.current_semester,
            profile_completed: userProfile.profile_completed,
          }

          return { success: true, user }
        }
      }

      return { success: false, error: "User profile not found" }
    } catch (error) {
      console.error("Login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async signup(signupData: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Generate email from full name
      const email = `${signupData.fullName.toLowerCase().replace(/\s+/g, ".")}@student.mu.ac.in`
      const prn = signupData.rollNumber || `PRN${Date.now()}`

      // For demo purposes, don't actually create Supabase auth user
      // Just create the profile in our database
      const demoUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        prn: prn,
        fullName: signupData.fullName,
        current_semester: this.mapYearToSemester(signupData.yearOfStudy),
        profile_completed: true,
      }

      // Store in localStorage for demo
      localStorage.setItem("auth_user", JSON.stringify(demoUser))
      localStorage.setItem("auth_token", `token_${Date.now()}`)

      return { success: true, user: demoUser }
    } catch (error) {
      console.error("Signup error:", error)
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  private mapYearToSemester(yearOfStudy: string): number {
    const availableSemesters = mapUserYearToSemesters(yearOfStudy)
    return availableSemesters[0] // Return first semester of the year as default
  }

  // Add a new method to get user's year level
  getUserYearLevel(yearOfStudy: string): string {
    const yearMap: { [key: string]: string } = {
      FY: "FY",
      SY: "SY",
      TY: "TY",
      BE: "BE",
      PG: "PG",
      PhD: "PhD",
      Other: "FY",
    }
    return yearMap[yearOfStudy] || "FY"
  }

  async logout(): Promise<void> {
    try {
      await supabase.auth.signOut()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Always clear localStorage
      localStorage.removeItem("auth_user")
      localStorage.removeItem("auth_token")
    }
  }

  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null

    try {
      const userStr = localStorage.getItem("auth_user")
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false
    return !!localStorage.getItem("auth_token")
  }
}

export const authService = new AuthService()
