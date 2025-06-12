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
  // Additional MindNest specific fields
  yearOfStudy?: string
  department?: string
  faculty?: string
  coreSubject?: string
  electivePhysics?: string
  electiveChemistry?: string
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
  private isClient = typeof window !== 'undefined'

  async login(prn: string, password: string): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      // Demo mode check - only in development
      if (process.env.NODE_ENV === 'development' && prn === 'demo' && password === 'demo') {
        const demoUser: User = {
          id: "demo-user-123",
          email: "demo@mindnest.app",
          prn: "demo",
          fullName: "Demo Student",
          college_id: "demo-college",
          program_id: "demo-program",
          current_semester: 3,
          profile_completed: true,
          yearOfStudy: "FY",
          department: "Computer Engineering",
          faculty: "Engineering"
        }

        if (this.isClient) {
          localStorage.setItem("mindnest_user", JSON.stringify(demoUser))
          localStorage.setItem("mindnest_token", "demo_token_123")
        }

        return { success: true, user: demoUser }
      }

      // Real authentication flow
      const email = `${prn}@student.mindnest.app`

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      if (data.user) {
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
      console.error("MindNest login error:", error)
      return { success: false, error: "Login failed. Please try again." }
    }
  }

  async signup(signupData: SignupData): Promise<{ success: boolean; user?: User; error?: string }> {
    try {
      const email = `${signupData.fullName.toLowerCase().replace(/\s+/g, ".")}@student.mindnest.app`
      const prn = signupData.rollNumber || `PRN${Date.now()}`

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        prn: prn,
        fullName: signupData.fullName,
        current_semester: this.mapYearToSemester(signupData.yearOfStudy),
        profile_completed: true,
        yearOfStudy: signupData.yearOfStudy,
        department: signupData.department,
        faculty: signupData.faculty,
        coreSubject: signupData.coreSubject,
        electivePhysics: signupData.electivePhysics,
        electiveChemistry: signupData.electiveChemistry,
      }

      if (this.isClient) {
        localStorage.setItem("mindnest_user", JSON.stringify(newUser))
        localStorage.setItem("mindnest_token", `token_${Date.now()}`)
      }

      return { success: true, user: newUser }
    } catch (error) {
      console.error("MindNest signup error:", error)
      return { success: false, error: "Registration failed. Please try again." }
    }
  }

  private mapYearToSemester(yearOfStudy: string): number {
    const availableSemesters = mapUserYearToSemesters(yearOfStudy)
    return availableSemesters[0]
  }

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
      console.error("MindNest logout error:", error)
    } finally {
      if (this.isClient) {
        localStorage.removeItem("mindnest_user")
        localStorage.removeItem("mindnest_token")
      }
    }
  }

  getCurrentUser(): User | null {
    if (!this.isClient) return null

    try {
      const userStr = localStorage.getItem("mindnest_user")
      return userStr ? JSON.parse(userStr) : null
    } catch (error) {
      console.error("Error getting current user:", error)
      return null
    }
  }

  isAuthenticated(): boolean {
    if (!this.isClient) return false
    return !!localStorage.getItem("mindnest_token")
  }
}

export const authService = new AuthService()