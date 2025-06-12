"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  BookOpen,
  Calendar,
  ChevronDown,
  ChevronRight,
  Circle,
  Download,
  FileText,
  Gem,
  LayoutDashboard,
  LogOut,
  PieChart,
  Search,
  Settings,
  Square,
  Check,
  Clock,
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
} from "@/components/ui/sidebar"
import Link from "next/link"
import { getCoursesForStudent, calculateCourseProgress, type Course } from "@/lib/course-database"
import { useAuth } from "@/hooks/use-auth"

// Remove the hardcoded syllabusData and replace with dynamic loading
export default function SyllabusPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedUnits, setExpandedUnits] = useState<string[]>(["ch1"])
  const [completedTopics, setCompletedTopics] = useState<string[]>([])

  const { authState } = useAuth()
  const searchParams = useSearchParams()
  const courseFilter = searchParams.get("course")

  // Get student's courses
  const studentCourses = authState.user
    ? getCoursesForStudent(
        authState.user.faculty || "Engineering",
        authState.user.department || "Computer Engineering",
        authState.user.yearOfStudy || "FY",
        1, // Current semester
        authState.user.coreSubject,
        authState.user.electivePhysics,
        authState.user.electiveChemistry,
      )
    : []

  // Set the selected course based on URL parameter or default to first course
  useEffect(() => {
    if (courseFilter) {
      const course = studentCourses.find((c) => c.code === courseFilter)
      if (course) {
        setSelectedCourse(course.code)
      }
    } else if (studentCourses.length > 0 && !selectedCourse) {
      setSelectedCourse(studentCourses[0].code)
    }
  }, [courseFilter, studentCourses, selectedCourse])

  const currentCourse = studentCourses.find((course) => course.code === selectedCourse)

  const toggleUnit = (unitId: string) => {
    setExpandedUnits((prev) => (prev.includes(unitId) ? prev.filter((id) => id !== unitId) : [...prev, unitId]))
  }

  const toggleTopic = (topicId: string) => {
    setCompletedTopics((prev) => (prev.includes(topicId) ? prev.filter((id) => id !== topicId) : [...prev, topicId]))
  }

  const calculateProgress = () => {
    if (!currentCourse) return 0
    return calculateCourseProgress(currentCourse)
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
                  <div className="h-10 w-10 bg-yellow-500 border-4 border-black rotate-12"></div>
                  <div className="h-10 w-10 bg-blue-600 border-4 border-black -ml-5 -rotate-12"></div>
                </div>
                <span className="font-black text-xl tracking-tighter">STUDGEM</span>
              </SidebarHeader>

              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>NAVIGATION</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton tooltip="Dashboard">
                          <Link href="/dashboard" className="flex items-center gap-3 w-full">
                            <LayoutDashboard />
                            <span>Dashboard</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="Syllabus">
                          <BookOpen />
                          <span>Syllabus</span>
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
                            <span>StudGem AI</span>
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
                    <SidebarMenuButton tooltip="Logout">
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
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              expandedUnits={expandedUnits}
              toggleUnit={toggleUnit}
              completedTopics={completedTopics}
              toggleTopic={toggleTopic}
              calculateProgress={calculateProgress}
              courseFilter={courseFilter}
              studentCourses={studentCourses}
              currentCourse={currentCourse}
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
  selectedCourse,
  setSelectedCourse,
  searchQuery,
  setSearchQuery,
  expandedUnits,
  toggleUnit,
  completedTopics,
  toggleTopic,
  calculateProgress,
  courseFilter,
  studentCourses,
  currentCourse,
}: {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  selectedCourse: string
  setSelectedCourse: (value: string) => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  expandedUnits: string[]
  toggleUnit: (unitId: string) => void
  completedTopics: string[]
  toggleTopic: (topicId: string) => void
  calculateProgress: () => number
  courseFilter: string | null
  studentCourses: Course[]
  currentCourse: Course | undefined
}) {
  const progress = calculateProgress()

  return (
    <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4 flex-1">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <BookOpen className="h-6 w-6" />
              <h1 className="text-lg md:text-xl font-black">SYLLABUS TRACKER</h1>
              {courseFilter && (
                <Link
                  href="/dashboard"
                  className="bg-blue-600 text-white border-4 border-black px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-sm"
                >
                  ← BACK TO DASHBOARD
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="h-10 w-10 bg-yellow-500 border-4 border-black flex items-center justify-center hover:bg-yellow-400 transition-colors"
            >
              {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Page Title */}
          <div className="space-y-3">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">Course Syllabus</h1>
            <div className="flex gap-3 items-center">
              <div className="h-6 w-6 bg-red-600"></div>
              <div className="h-6 w-6 bg-blue-600"></div>
              <div className="h-6 w-6 bg-yellow-500"></div>
              <p className="text-lg md:text-xl">Track your progress through each course syllabus</p>
            </div>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Selector */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">SELECT COURSE</h3>
              <div className="space-y-3">
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full border-4 border-black p-3 font-mono text-lg shadow-brutal focus:outline-none focus:border-blue-600"
                >
                  <option value="">Select Course</option>
                  {studentCourses.map((course) => (
                    <option key={course.code} value={course.code}>
                      {course.code} - {course.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search */}
            <div className="bg-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">SEARCH TOPICS</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search syllabus topics..."
                  className="border-4 border-black pl-10 h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Progress */}
            <div className="bg-blue-600 text-white border-8 border-black p-6 shadow-brutal">
              <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-white pb-2">PROGRESS</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <div className="text-4xl font-black">{progress}%</div>
                  <div className="text-sm uppercase font-bold mt-1">Complete</div>
                </div>
                <div className="relative w-20 h-20">
                  <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-white opacity-30"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-yellow-500"
                      stroke="currentColor"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray={`${progress}, 100`}
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Syllabus Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Syllabus Tree */}
            <div className="lg:col-span-2 bg-white border-8 border-black p-6 shadow-brutal">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black uppercase border-b-4 border-black pb-2">{currentCourse?.name}</h3>
                <button className="bg-red-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  PDF
                </button>
              </div>

              <div className="space-y-4">
                {currentCourse?.chapters.map((chapter) => (
                  <div key={chapter.id} className="border-4 border-black">
                    <button
                      onClick={() => toggleUnit(chapter.id)}
                      className="w-full p-4 bg-gray-100 hover:bg-gray-200 transition-colors flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        {expandedUnits.includes(chapter.id) ? (
                          <ChevronDown className="h-5 w-5" />
                        ) : (
                          <ChevronRight className="h-5 w-5" />
                        )}
                        <span className="font-bold text-lg">{chapter.title}</span>
                        <span className="text-sm bg-blue-100 px-2 py-1 border-2 border-black">
                          {chapter.weightage}% weightage
                        </span>
                      </div>
                      <div className="text-sm font-bold">
                        {chapter.topics.filter((topic) => completedTopics.includes(topic.id)).length}/
                        {chapter.topics.length}
                      </div>
                    </button>

                    {expandedUnits.includes(chapter.id) && (
                      <div className="bg-white">
                        {chapter.topics.map((topic) => (
                          <div
                            key={topic.id}
                            className="flex items-center justify-between p-4 border-t-4 border-gray-200 hover:bg-gray-50"
                          >
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => toggleTopic(topic.id)}
                                className={`h-6 w-6 border-4 border-black flex items-center justify-center ${
                                  completedTopics.includes(topic.id) ? "bg-green-500 text-white" : "bg-white"
                                }`}
                              >
                                {completedTopics.includes(topic.id) && <Check className="h-4 w-4" />}
                              </button>
                              <span className="font-mono">{topic.id}</span>
                              <span className={completedTopics.includes(topic.id) ? "line-through" : ""}>
                                {topic.title}
                              </span>
                              <span
                                className={`text-xs px-2 py-1 border border-black ${
                                  topic.difficulty === "easy"
                                    ? "bg-green-100"
                                    : topic.difficulty === "medium"
                                      ? "bg-yellow-100"
                                      : "bg-red-100"
                                }`}
                              >
                                {topic.difficulty}
                              </span>
                              <span className="text-xs text-gray-500">~{topic.estimatedHours}h</span>
                            </div>
                            <div className="flex items-center gap-2">
                              {completedTopics.includes(topic.id) ? (
                                <span className="text-green-600 font-bold text-sm">COMPLETED</span>
                              ) : (
                                <span className="text-orange-600 font-bold text-sm">PENDING</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-6">
              <div className="bg-black text-white border-8 border-black p-6 shadow-brutal-inverse">
                <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-white pb-2">QUICK ACTIONS</h3>
                <div className="space-y-4">
                  <button className="w-full bg-white text-black border-4 border-white px-4 py-3 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all">
                    MARK ALL AS READ
                  </button>
                  <button className="w-full bg-yellow-500 text-black border-4 border-white px-4 py-3 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all">
                    GENERATE QUIZ
                  </button>
                  <button className="w-full bg-blue-600 text-white border-4 border-white px-4 py-3 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all">
                    STUDY PLAN
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-8 border-black p-6 shadow-brutal text-white">
                <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">STUDY TIPS</h3>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Focus on high-frequency exam topics first</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Complete one unit before moving to the next</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Clock className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>Use AI assistant for topic explanations</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
