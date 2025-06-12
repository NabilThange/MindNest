"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import {
  BookOpen,
  Calendar,
  Circle,
  Download,
  ExternalLink,
  FileText,
  Gem,
  Heart,
  LayoutDashboard,
  LogOut,
  PieChart,
  Play,
  Plus,
  Search,
  Settings,
  Square,
  Star,
  Upload,
  X,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { getCoursesForStudent, type Resource } from "@/lib/course-database"
import { useAuth } from "@/hooks/use-auth"

export default function ResourcesPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showSuggestModal, setShowSuggestModal] = useState(false)
  const [bookmarkedItems, setBookmarkedItems] = useState<string[]>([])
  const [newResource, setNewResource] = useState({
    title: "",
    url: "",
    subject: "",
    difficulty: "",
    tags: "",
    description: "",
  })

  const { authState } = useAuth()
  const searchParams = useSearchParams()
  const courseFilter = searchParams.get("course")

  const [allResources, setAllResources] = useState<Resource[]>([])
  const [selectedSubjectParam, setSelectedSubjectParam] = useState<string | null>(null)

  useEffect(() => {
    if (authState.user) {
      const studentCourses = getCoursesForStudent(
        authState.user.faculty || "Engineering",
        authState.user.department || "Computer Engineering",
        authState.user.yearOfStudy || "FY",
        1, // Current semester
        authState.user.coreSubject,
        authState.user.electivePhysics,
        authState.user.electiveChemistry,
      )

      // Aggregate all resources from student's courses
      const resources = studentCourses.reduce((acc: Resource[], course) => {
        const courseResources = course.resources.map((resource) => ({
          ...resource,
          subject: course.code,
          courseName: course.name,
        }))
        return [...acc, ...courseResources]
      }, [])

      setAllResources(resources)
    }
  }, [authState.user])

  // Categorize resources by type with null checks
  const resourcesData = {
    videos: allResources.filter((r) => r && r.type === "video") || [],
    pdfs: allResources.filter((r) => r && (r.type === "pdf" || r.type === "notes" || r.type === "book")) || [],
    uploads: allResources.filter((r) => r && r.type === "link") || [],
  }

  // Add this right after the resourcesData definition
  if (!authState.user) {
    return <div>Loading...</div>
  }

  // Set the selected subject based on URL parameter
  useEffect(() => {
    if (courseFilter) {
      setSelectedSubjectParam(courseFilter)
    }
  }, [courseFilter])

  useEffect(() => {
    if (selectedSubjectParam) {
      setSelectedSubject(selectedSubjectParam)
    }
  }, [selectedSubjectParam])

  const toggleBookmark = (id: string) => {
    setBookmarkedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const handleSuggestResource = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would submit to backend for admin review
    console.log("Suggesting resource:", newResource)
    setShowSuggestModal(false)
    setNewResource({ title: "", url: "", subject: "", difficulty: "", tags: "", description: "" })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? "fill-yellow-500 text-yellow-500" : "text-gray-300"}`}
      />
    ))
  }

  const filterResources = (resources: any[]) => {
    if (!resources || !Array.isArray(resources)) return []

    return resources.filter((resource) => {
      if (!resource) return false

      const matchesSearch =
        (resource.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (Array.isArray(resource.tags) ? resource.tags : []).some(
          (tag: string) => tag && tag.toLowerCase().includes(searchQuery.toLowerCase()),
        )
      const matchesSubject = selectedSubject === "all" || resource.subject === selectedSubject
      const matchesDifficulty = selectedDifficulty === "all" || resource.difficulty === selectedDifficulty

      return matchesSearch && matchesSubject && matchesDifficulty
    })
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
                        <SidebarMenuButton isActive tooltip="Resources">
                          <FileText />
                          <span>Resources</span>
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
            <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
              {/* Header */}
              <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-white">
                <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
                  <div className="flex items-center gap-4 flex-1">
                    <SidebarTrigger />
                    <div className="flex items-center gap-4">
                      <FileText className="h-6 w-6" />
                      <h1 className="text-lg md:text-xl font-black">STUDY RESOURCES</h1>
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
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter uppercase">
                      Study Resources
                    </h1>
                    <div className="flex gap-3 items-center">
                      <div className="h-6 w-6 bg-red-600"></div>
                      <div className="h-6 w-6 bg-blue-600"></div>
                      <div className="h-6 w-6 bg-yellow-500"></div>
                      <p className="text-lg md:text-xl">Discover and bookmark quality study materials</p>
                    </div>
                  </div>

                  {/* Search and Filters */}
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    <div className="lg:col-span-2 bg-white border-8 border-black p-6 shadow-brutal">
                      <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">SEARCH</h3>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
                        <Input
                          type="search"
                          placeholder="Search resources, tags..."
                          className="border-4 border-black pl-10 h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 w-full"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="bg-white border-8 border-black p-6 shadow-brutal">
                      <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">SUBJECT</h3>
                      <select
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                      >
                        <option value="all">All Subjects</option>
                        {authState.user &&
                          getCoursesForStudent(
                            authState.user.faculty || "Engineering",
                            authState.user.department || "Computer Engineering",
                            authState.user.yearOfStudy || "FY",
                            1, // Current semester
                            authState.user.coreSubject,
                            authState.user.electivePhysics,
                            authState.user.electiveChemistry,
                          ).map((course) => (
                            <option key={course.code} value={course.code}>
                              {course.code} - {course.name}
                            </option>
                          ))}
                      </select>
                    </div>

                    <div className="bg-white border-8 border-black p-6 shadow-brutal">
                      <h3 className="text-xl font-black mb-4 uppercase border-b-4 border-black pb-2">DIFFICULTY</h3>
                      <select
                        value={selectedDifficulty}
                        onChange={(e) => setSelectedDifficulty(e.target.value)}
                        className="w-full border-4 border-black p-3 font-mono shadow-brutal focus:outline-none focus:border-blue-600"
                      >
                        <option value="all">All Levels</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <button
                      onClick={() => setShowSuggestModal(true)}
                      className="bg-blue-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2"
                    >
                      <Plus className="h-5 w-5" />
                      SUGGEST RESOURCE
                    </button>
                    <button className="bg-yellow-500 border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                      <Heart className="h-5 w-5" />
                      VIEW BOOKMARKS
                    </button>
                    <button className="bg-green-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2">
                      <Upload className="h-5 w-5" />
                      UPLOAD FILE
                    </button>
                  </div>

                  {/* Resources Tabs */}
                  <Tabs defaultValue="videos" className="space-y-8">
                    <TabsList className="grid w-full max-w-md grid-cols-3 h-14 bg-transparent gap-4">
                      <TabsTrigger
                        value="videos"
                        className="data-[state=active]:bg-red-600 data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        VIDEOS
                      </TabsTrigger>
                      <TabsTrigger
                        value="pdfs"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        PDFs
                      </TabsTrigger>
                      <TabsTrigger
                        value="uploads"
                        className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                        bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
                      >
                        UPLOADS
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="videos" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filterResources(resourcesData.videos || []).map((video) => (
                          <div key={video.id} className="bg-white border-8 border-black shadow-brutal">
                            <div className="relative">
                              <img
                                src={video.thumbnail || "/placeholder.svg"}
                                alt={video.title}
                                className="w-full h-48 object-cover border-b-4 border-black"
                              />
                              <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-sm font-bold">
                                {video.duration || "Video"}
                              </div>
                              <div className="absolute top-2 left-2">
                                <Play className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg leading-tight">{video.title}</h4>
                                <button
                                  onClick={() => toggleBookmark(video.id)}
                                  className={`p-1 ${
                                    bookmarkedItems.includes(video.id) ? "text-red-600" : "text-gray-400"
                                  }`}
                                >
                                  <Heart
                                    className={`h-5 w-5 ${bookmarkedItems.includes(video.id) ? "fill-current" : ""}`}
                                  />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm bg-gray-200 px-2 py-1 border-2 border-black font-bold">
                                  {video.subject}
                                </span>
                                <span
                                  className={`text-sm px-2 py-1 border-2 border-black font-bold ${
                                    video.difficulty === "beginner"
                                      ? "bg-green-200"
                                      : video.difficulty === "intermediate"
                                        ? "bg-yellow-200"
                                        : "bg-red-200"
                                  }`}
                                >
                                  {video.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {renderStars(video.rating)}
                                <span className="text-sm font-bold ml-1">{video.rating}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-4">
                                {(video.tags || []).map((tag, index) => (
                                  <span key={index} className="text-xs bg-blue-100 px-2 py-1 border border-black">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => window.open(video.url, "_blank")}
                                className="w-full bg-red-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                              >
                                <ExternalLink className="h-4 w-4" />
                                WATCH VIDEO
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="pdfs" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filterResources(resourcesData.pdfs || []).map((pdf) => (
                          <div key={pdf.id} className="bg-white border-8 border-black shadow-brutal">
                            <div className="relative">
                              <img
                                src={pdf.thumbnail || "/placeholder.svg"}
                                alt={pdf.title}
                                className="w-full h-48 object-cover border-b-4 border-black"
                              />
                              <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-sm font-bold">
                                {pdf.pages} pages
                              </div>
                              <div className="absolute top-2 left-2">
                                <FileText className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg leading-tight">{pdf.title}</h4>
                                <button
                                  onClick={() => toggleBookmark(pdf.id)}
                                  className={`p-1 ${
                                    bookmarkedItems.includes(pdf.id) ? "text-red-600" : "text-gray-400"
                                  }`}
                                >
                                  <Heart
                                    className={`h-5 w-5 ${bookmarkedItems.includes(pdf.id) ? "fill-current" : ""}`}
                                  />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm bg-gray-200 px-2 py-1 border-2 border-black font-bold">
                                  {pdf.subject}
                                </span>
                                <span
                                  className={`text-sm px-2 py-1 border-2 border-black font-bold ${
                                    pdf.difficulty === "Beginner"
                                      ? "bg-green-200"
                                      : pdf.difficulty === "Intermediate"
                                        ? "bg-yellow-200"
                                        : "bg-red-200"
                                  }`}
                                >
                                  {pdf.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-3">
                                {renderStars(pdf.rating)}
                                <span className="text-sm font-bold ml-1">{pdf.rating}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-4">
                                {(pdf.tags || []).map((tag, index) => (
                                  <span key={index} className="text-xs bg-blue-100 px-2 py-1 border border-black">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <button
                                onClick={() => window.open(pdf.url, "_blank")}
                                className="w-full bg-blue-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                              >
                                <Download className="h-4 w-4" />
                                DOWNLOAD PDF
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="uploads" className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filterResources(resourcesData.uploads || []).map((upload) => (
                          <div key={upload.id} className="bg-white border-8 border-black shadow-brutal">
                            <div className="relative">
                              <img
                                src={upload.thumbnail || "/placeholder.svg"}
                                alt={upload.title}
                                className="w-full h-48 object-cover border-b-4 border-black"
                              />
                              <div className="absolute bottom-2 right-2 bg-black text-white px-2 py-1 text-sm font-bold">
                                {upload.type}
                              </div>
                              <div className="absolute top-2 left-2">
                                <Upload className="h-8 w-8 text-white bg-black bg-opacity-50 rounded-full p-1" />
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg leading-tight">{upload.title}</h4>
                                <button
                                  onClick={() => toggleBookmark(upload.id)}
                                  className={`p-1 ${
                                    bookmarkedItems.includes(upload.id) ? "text-red-600" : "text-gray-400"
                                  }`}
                                >
                                  <Heart
                                    className={`h-5 w-5 ${bookmarkedItems.includes(upload.id) ? "fill-current" : ""}`}
                                  />
                                </button>
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm bg-gray-200 px-2 py-1 border-2 border-black font-bold">
                                  {upload.subject}
                                </span>
                                <span
                                  className={`text-sm px-2 py-1 border-2 border-black font-bold ${
                                    upload.difficulty === "Beginner"
                                      ? "bg-green-200"
                                      : upload.difficulty === "Intermediate"
                                        ? "bg-yellow-200"
                                        : "bg-red-200"
                                  }`}
                                >
                                  {upload.difficulty}
                                </span>
                              </div>
                              <div className="flex items-center gap-1 mb-2">
                                {renderStars(upload.rating)}
                                <span className="text-sm font-bold ml-1">{upload.rating}</span>
                              </div>
                              <div className="text-sm text-gray-600 mb-3">
                                Uploaded by: <span className="font-bold">{upload.uploadedBy}</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mb-4">
                                {(upload.tags || []).map((tag, index) => (
                                  <span key={index} className="text-xs bg-blue-100 px-2 py-1 border border-black">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <button className="w-full bg-black text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                                <Download className="h-4 w-4" />
                                DOWNLOAD
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </main>
            </div>
          </div>

          {/* Suggest Resource Modal */}
          {showSuggestModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white border-8 border-black p-6 shadow-brutal max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-black uppercase">SUGGEST RESOURCE</h3>
                  <button
                    onClick={() => setShowSuggestModal(false)}
                    className="bg-red-600 text-white border-4 border-black p-2"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSuggestResource} className="space-y-4">
                  <div>
                    <Label htmlFor="title" className="font-bold">
                      RESOURCE TITLE
                    </Label>
                    <Input
                      id="title"
                      value={newResource.title}
                      onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                      className="border-4 border-black h-12 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="url" className="font-bold">
                      URL
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="border-4 border-black h-12 font-mono"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject" className="font-bold">
                      SUBJECT
                    </Label>
                    <select
                      id="subject"
                      value={newResource.subject}
                      onChange={(e) => setNewResource({ ...newResource, subject: e.target.value })}
                      className="w-full border-4 border-black h-12 font-mono"
                      required
                    >
                      <option value="">Select Subject</option>
                      <option value="CS401">CS401 - Database Management</option>
                      <option value="CS402">CS402 - Data Structures</option>
                      <option value="CS403">CS403 - Computer Networks</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="font-bold">
                      DIFFICULTY
                    </Label>
                    <select
                      id="difficulty"
                      value={newResource.difficulty}
                      onChange={(e) => setNewResource({ ...newResource, difficulty: e.target.value })}
                      className="w-full border-4 border-black h-12 font-mono"
                      required
                    >
                      <option value="">Select Difficulty</option>
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>

                  <div>
                    <Label htmlFor="tags" className="font-bold">
                      TAGS (comma separated)
                    </Label>
                    <Input
                      id="tags"
                      placeholder="e.g., SQL, Database, Tutorial"
                      value={newResource.tags}
                      onChange={(e) => setNewResource({ ...newResource, tags: e.target.value })}
                      className="border-4 border-black h-12 font-mono"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description" className="font-bold">
                      DESCRIPTION
                    </Label>
                    <textarea
                      id="description"
                      placeholder="Brief description of the resource..."
                      value={newResource.description}
                      onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                      className="w-full border-4 border-black p-3 font-mono h-24 resize-none"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowSuggestModal(false)}
                      className="flex-1 bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      CANCEL
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-blue-600 text-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                    >
                      SUGGEST
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </SidebarProvider>
      </div>
    </div>
  )
}
