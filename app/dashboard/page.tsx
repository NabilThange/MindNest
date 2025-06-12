"use client"

import { useState, useEffect } from "react"
import {
  Bell,
  BookOpen,
  Calendar,
  Circle,
  FileText,
  Gem,
  LayoutDashboard,
  LogOut,
  PieChart,
  Search,
  Settings,
  Square,
  User,
  Brain,
  Network,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"
import { CourseCard } from "../course-card"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { SemesterSelector } from "@/components/semester-selector"
import { useSemesterData } from "@/hooks/use-semester-data"
import { getUserAvailableSemesters } from "@/lib/semester-utils"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { authState, logout } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (!authState.isLoading && !authState.isAuthenticated) {
      router.push("/landing")
    }
  }, [authState.isAuthenticated, authState.isLoading, router])

  const handleLogout = () => {
    logout()
    router.push("/landing")
  }

  if (authState.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 bg-yellow-500 border-4 border-black rotate-12 flex items-center justify-center animate-pulse">
              <Brain className="h-6 w-6 text-black" />
            </div>
            <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 -rotate-12 flex items-center justify-center animate-pulse">
              <Network className="h-6 w-6 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black font-mono">MINDNEST</h1>
          <p className="font-bold font-mono">Loading Dashboard...</p>
          <LoadingSpinner className="mt-4" />
        </div>
      </div>
    )
  }

  if (!authState.isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className={`min-h-screen font-mono ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground min-h-screen">
        <SidebarProvider>
          <div className="flex min-h-screen">
            {/* Sidebar */}
            <Sidebar className="z-50">
              <SidebarHeader className="flex flex-col items-center justify-center py-6">
                <div className="flex items-center mb-2">
                  <div className="h-10 w-10 bg-yellow-500 border-4 border-black rotate-12 flex items-center justify-center">
                    <Brain className="h-5 w-5 text-black" />
                  </div>
                  <div className="h-10 w-10 bg-blue-600 border-4 border-black -ml-5 -rotate-12 flex items-center justify-center">
                    <Network className="h-5 w-5 text-white" />
                  </div>
                </div>
                <span className="font-black text-xl tracking-tighter">MINDNEST</span>
                {authState.user && (
                  <p className="text-sm font-bold text-gray-600 mt-1">
                    Welcome, {authState.user.fullName.split(" ")[0]}!
                  </p>
                )}
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>NAVIGATION</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Dashboard">
                          <LayoutDashboard />
                          <span>Dashboard</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Syllabus">
                          <Link href="/syllabus" className="flex items-center gap-3 w-full">
                            <BookOpen />
                            <span>Syllabus</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Schedule">
                          <Link href="/schedule" className="flex items-center gap-3 w-full">
                            <Calendar />
                            <span>Schedule</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Resources">
                          <Link href="/resources" className="flex items-center gap-3 w-full">
                            <FileText />
                            <span>Resources</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="AI Assistant">
                          <Link href="/ai-assistant" className="flex items-center gap-3 w-full">
                            <Gem />
                            <span>MindNest AI</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Analytics">
                          <Link href="/analytics" className="flex items-center gap-3 w-full">
                            <PieChart />
                            <span>Analytics</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Settings">
                      <Settings />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                      <LogOut />
                      <span>Logout</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main Content */}
            <MainContent
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              user={authState.user}
              router={router}
            />
          </div>
        </SidebarProvider>
      </div>
    </div>
  )
}

function MainContent({
  darkMode,
  setDarkMode,
  searchQuery,
  setSearchQuery,
  user,
  router,
}: {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  user: any
  router: any
}) {
  const { open } = useSidebar()

  return (
    <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger />
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
              <Input
                type="search"
                placeholder="Search courses, resources..."
                className="border-4 border-black pl-10 h-10 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative h-10 w-10 bg-white border-4 border-black flex items-center justify-center hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-600 rounded-full text-white text-xs flex items-center justify-center">
                3
              </span>
            </button>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </button>
            <button
              onClick={() => router.push("/profile")}
              className="h-10 w-10 bg-blue-600 text-white border-4 border-black flex items-center justify-center hover:bg-blue-500 transition-colors"
            >
              <User className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8">
        <DashboardContent user={user} />
      </main>
    </div>
  )
}

function DashboardContent({ user }: { user: any }) {
  const userName = user?.fullName?.split(" ")[0] || "Student"
  const userCourse = user?.department || "Computer Science"
  const userYear = user?.yearOfStudy || "FY"

  // Get available semesters for user's year
  const availableMapping = getUserAvailableSemesters(userYear)

  // State for semester selection
  const [selectedSemesterId, setSelectedSemesterId] = useState<string>("")
  const [selectedSemesterInfo, setSelectedSemesterInfo] = useState<any>(null)

  // Get semester-specific data
  const { subjects, progress, progressStats, loading: semesterLoading } = useSemesterData(selectedSemesterId)

  const handleSemesterChange = (semesterId: string, semesterInfo: any) => {
    setSelectedSemesterId(semesterId)
    setSelectedSemesterInfo(semesterInfo)
  }

  return (
    <div className="space-y-10 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="space-y-3">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">Welcome, {userName}!</h1>
        <div className="flex gap-3 items-center">
          <div className="h-6 w-6 bg-red-600"></div>
          <div className="h-6 w-6 bg-blue-600"></div>
          <div className="h-6 w-6 bg-yellow-500"></div>
          <p className="text-lg md:text-xl">
            {userCourse} • {availableMapping?.yearLabel || userYear}
          </p>
          {availableMapping && (
            <div className="bg-blue-100 border-2 border-black px-3 py-1 text-sm font-bold">
              📚 {availableMapping.semesterLabels.join(" & ")}
            </div>
          )}
        </div>
      </div>

      {/* Semester Selector */}
      <SemesterSelector onSemesterChange={handleSemesterChange} selectedSemesterId={selectedSemesterId} />

      {/* Progress & Stats - Updated with semester data */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border-8 border-black p-6 shadow-brutal">
          <h3 className="text-xl font-black mb-5 uppercase border-b-4 border-black pb-2">
            {selectedSemesterInfo ? `${selectedSemesterInfo.semester_label} PROGRESS` : "PROGRESS"}
          </h3>
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">Semester Completion</span>
                <span className="font-bold">{progressStats.completionPercentage}%</span>
              </div>
              <div className="w-full h-6 bg-gray-200 border-4 border-black">
                <div className="h-full bg-blue-600" style={{ width: `${progressStats.completionPercentage}%` }}></div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">Topics Completed</span>
                <span className="font-bold">
                  {progressStats.completedTopics}/{progressStats.totalTopics}
                </span>
              </div>
              <div className="w-full h-6 bg-gray-200 border-4 border-black">
                <div className="h-full bg-green-600" style={{ width: `${progressStats.completionPercentage}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Keep existing streak and upcoming cards */}
        <div className="bg-blue-600 text-white border-8 border-black p-6 shadow-brutal">
          <h3 className="text-xl font-black mb-5 uppercase border-b-4 border-white pb-2">STREAK</h3>
          <div className="flex items-center justify-between mb-5">
            <div className="text-center">
              <div className="text-4xl lg:text-5xl font-black">14</div>
              <div className="text-sm uppercase font-bold mt-1">Days</div>
            </div>
            <div className="flex space-x-1 lg:space-x-2">
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-white border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-yellow-500 border-4 border-black"></div>
              <div className="h-6 w-6 lg:h-8 lg:w-8 bg-yellow-500 border-4 border-black"></div>
            </div>
          </div>
          <div className="pt-4 border-t-4 border-white">
            <div className="flex justify-between items-center">
              <span className="font-bold">Current Level</span>
              <span className="font-bold">EXPLORER</span>
            </div>
            <div className="w-full h-6 bg-black border-4 border-white mt-2">
              <div className="h-full bg-yellow-500" style={{ width: "75%" }}></div>
            </div>
          </div>
        </div>

        <div className="bg-black text-white border-8 border-black p-6 shadow-brutal-inverse">
          <h3 className="text-xl font-black mb-5 uppercase border-b-4 border-white pb-2">UPCOMING</h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">Database Assignment</p>
                <p className="text-sm text-gray-300">Due in 2 days</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-yellow-500 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">Mid-Semester Exam</p>
                <p className="text-sm text-gray-300">Next Monday</p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-blue-600 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">Project Presentation</p>
                <p className="text-sm text-gray-300">In 5 days</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {/* Course Cards - Updated with semester filtering */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase border-b-4 border-black pb-2 inline-block">
            {selectedSemesterInfo
              ? `${selectedSemesterInfo.semester_label} SUBJECTS`
              : `${availableMapping?.yearLabel || userYear} SUBJECTS`}
          </h2>
          <div className="text-sm font-bold bg-green-100 border-4 border-black px-4 py-2">
            📚 {subjects.length} SUBJECTS LOADED
            {selectedSemesterInfo && <span className="ml-2 text-blue-600">| {selectedSemesterInfo.year_label}</span>}
          </div>
        </div>

        {semesterLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 border-4 border-black p-6 shadow-brutal animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {subjects.map((subject) => {
              const subjectProgress = progress.filter((p) => p.topics?.chapters?.subjects?.id === subject.id)
              const completedTopics = subjectProgress.filter((p) => p.is_completed).length
              const totalTopics = subjectProgress.length
              const progressPercentage = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0

              const getColorForCourse = (courseCode: string) => {
                if (courseCode.startsWith("FEC")) return { bg: "bg-blue-600", text: "text-white" }
                if (courseCode.startsWith("PCC")) return { bg: "bg-red-600", text: "text-white" }
                if (courseCode.startsWith("BSC")) return { bg: "bg-green-600", text: "text-white" }
                return { bg: "bg-gray-600", text: "text-white" }
              }

              const colors = getColorForCourse(subject.code)

              return (
                <CourseCard
                  key={subject.id}
                  title={subject.name}
                  code={subject.code}
                  progress={progressPercentage}
                  color={colors.bg}
                  textColor={colors.text}
                  assignments={completedTopics}
                  totalAssignments={totalTopics}
                  nextExam="Next Week"
                />
              )
            })}
          </div>
        )}

        {subjects.length === 0 && !semesterLoading && (
          <div className="text-center py-12 bg-gray-100 border-4 border-dashed border-black">
            <h3 className="text-xl font-black mb-2">NO SUBJECTS FOUND</h3>
            <p className="font-bold text-gray-600">
              {selectedSemesterInfo
                ? `No subjects available for ${selectedSemesterInfo.semester_label}`
                : "Select a semester to view subjects"}
            </p>
          </div>
        )}
      </div>

      {/* AI Assistant & Notices section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-8 border-black p-6 shadow-brutal">
          <h3 className="text-xl md:text-2xl font-black mb-5 uppercase border-b-4 border-black pb-2">
            MINDNEST AI ASSISTANT
          </h3>
          <p className="text-lg mb-6 text-white">
            Your personal AI learning companion. Ask questions, get explanations, and create study plans.
          </p>
          <div className="bg-white border-4 border-black p-4 mb-5">
            <p className="font-mono">What would you like help with today?</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button className="bg-white border-4 border-black px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm">
              EXPLAIN TOPIC
            </button>
            <button className="bg-white border-4 border-black px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm">
              GENERATE QUIZ
            </button>
            <button className="bg-white border-4 border-black px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm">
              STUDY PLAN
            </button>
          </div>
        </div>

        <div className="bg-white border-8 border-dashed border-black p-6 shadow-brutal">
          <h3 className="text-xl md:text-2xl font-black mb-5 uppercase border-b-4 border-black pb-2">
            NOTICES & SCHOLARSHIPS
          </h3>
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-red-600 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">Exam Schedule Released</p>
                <p className="text-sm text-gray-600">
                  The university has released the exam schedule for Semester 4.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-yellow-500 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">National Scholarship Portal</p>
                <p className="text-sm text-gray-600">
                  Applications open for merit-based scholarships. Deadline: June 15.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="h-6 w-6 bg-blue-600 mt-0.5 flex-shrink-0"></div>
              <div>
                <p className="font-bold">Internship Opportunity</p>
                <p className="text-sm text-gray-600">
                  TCS is offering summer internships for CS students. Apply by May 20.
                </p>
              </div>
            </li>
          </ul>
          <button className="bg-black text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all mt-5 w-full">
            VIEW ALL NOTICES
          </button>
        </div>
      </div>
    </div>
  )
}

// Helper function for course colors
function getColorForCourse(courseCode: string) {
  if (courseCode.startsWith("FEC")) return { bg: "bg-blue-600", text: "text-white" }
  if (courseCode.startsWith("PCC")) return { bg: "bg-red-600", text: "text-white" }
  if (courseCode.startsWith("BSC")) return { bg: "bg-green-600", text: "text-white" }
  return { bg: "bg-gray-600", text: "text-white" }
}