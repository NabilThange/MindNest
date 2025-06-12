"use client"

import type React from "react"

import { useState } from "react"
import {
  ArrowRight,
  BookOpen,
  ChevronDown,
  Circle,
  FileText,
  Gem,
  MessageSquare,
  PlusCircle,
  Send,
  Square,
  User,
  LayoutDashboard,
  Brain,
  Network,
} from "lucide-react"
import { Input } from "@/components/ui/input"
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

export default function AIAssistantPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [message, setMessage] = useState("")
  const [chatHistory, setChatHistory] = useState<{ role: "user" | "assistant"; content: string }[]>([
    {
      role: "assistant",
      content: "Hello! I'm MindNest AI, your learning assistant. How can I help you today?",
    },
  ])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    // Add user message to chat
    const newMessage = { role: "user" as const, content: message }
    setChatHistory([...chatHistory, newMessage])

    // Clear input
    setMessage("")

    // Simulate AI response (in a real app, this would call an AI API)
    setTimeout(() => {
      let response = ""

      if (message.toLowerCase().includes("database")) {
        response =
          "Database Management Systems (DBMS) is a software system that enables users to define, create, maintain and control access to the database. Key concepts include: tables, queries, normalization, and transactions. Would you like me to explain any of these concepts in more detail?"
      } else if (message.toLowerCase().includes("quiz") || message.toLowerCase().includes("test")) {
        response =
          "I can help you prepare for quizzes! Here are 3 practice questions on your recent topics:\n\n1. What is normalization in database design?\n2. Explain the difference between primary key and foreign key.\n3. What is SQL injection and how can it be prevented?\n\nWould you like answers to these questions or more practice problems?"
      } else if (message.toLowerCase().includes("study plan") || message.toLowerCase().includes("schedule")) {
        response =
          "Based on your upcoming exams, here's a suggested study plan for the next week:\n\n- Monday: Database Theory (2 hours)\n- Tuesday: SQL Practice (3 hours)\n- Wednesday: Data Structures Review (2 hours)\n- Thursday: Algorithm Practice (3 hours)\n- Friday: Mock Test (2 hours)\n- Weekend: Revision and Rest\n\nWould you like me to adjust this plan or create a more detailed schedule?"
      } else {
        response =
          "I'm here to help with your studies! You can ask me to explain concepts, generate practice quizzes, create study plans, or summarize your notes. What would you like assistance with today?"
      }

      setChatHistory((prev) => [...prev, { role: "assistant", content: response }])
    }, 1000)
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
                          <BookOpen />
                          <span>Syllabus</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive tooltip="AI Assistant">
                          <Gem />
                          <span>MindNest AI</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                  <SidebarGroupLabel>AI MODES</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <MessageSquare />
                          <span>Chat Mode</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <FileText />
                          <span>Note Analyzer</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton>
                          <PlusCircle />
                          <span>Quiz Generator</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>

              <SidebarFooter>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton tooltip="Profile">
                      <User />
                      <span>Profile</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarFooter>
            </Sidebar>

            {/* Main Content */}
            <MainContent
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              message={message}
              setMessage={setMessage}
              chatHistory={chatHistory}
              handleSendMessage={handleSendMessage}
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
  message,
  setMessage,
  chatHistory,
  handleSendMessage,
}: {
  darkMode: boolean
  setDarkMode: (value: boolean) => void
  message: string
  setMessage: (value: string) => void
  chatHistory: { role: "user" | "assistant"; content: string }[]
  handleSendMessage: (e: React.FormEvent) => void
}) {
  return (
    <div className="flex flex-col min-h-screen flex-1 transition-all duration-200">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b-8 border-black bg-gradient-to-r from-cyan-400 to-fuchsia-500">
        <div className="flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <div className="flex items-center">
              <Gem className="h-6 w-6 text-white" />
              <h1 className="text-lg md:text-xl font-black ml-2 text-white">MINDNEST AI ASSISTANT</h1>
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

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col px-4 md:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
          <Tabs defaultValue="chat" className="h-full flex flex-col">
            <TabsList className="grid w-full max-w-md grid-cols-3 h-14 bg-transparent gap-4 mb-8">
              <TabsTrigger
                value="chat"
                className="data-[state=active]:bg-cyan-400 data-[state=active]:text-black data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
              >
                CHAT
              </TabsTrigger>
              <TabsTrigger
                value="syllabus"
                className="data-[state=active]:bg-fuchsia-500 data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
              >
                SYLLABUS
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                className="data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:border-black data-[state=active]:border-4 data-[state=active]:shadow-brutal
                bg-white border-4 border-black text-sm md:text-lg font-bold h-full"
              >
                NOTES
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chat" className="flex-1 flex flex-col space-y-5">
              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto border-8 border-black p-4 md:p-6 bg-white shadow-brutal">
                <div className="space-y-6 md:space-y-8">
                  {chatHistory.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[85%] md:max-w-[80%] p-4 border-4 border-black ${
                          msg.role === "user"
                            ? "bg-blue-600 text-white"
                            : "bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white"
                        }`}
                      >
                        <p className="whitespace-pre-line text-sm md:text-base">{msg.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Suggestions */}
              <div className="flex flex-wrap gap-2 md:gap-3">
                <button
                  onClick={() => {
                    setMessage("Explain database normalization")
                  }}
                  className="bg-white border-4 border-black px-2 md:px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-xs md:text-sm flex items-center gap-1"
                >
                  <span>Explain database normalization</span>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button
                  onClick={() => {
                    setMessage("Generate a quiz on SQL basics")
                  }}
                  className="bg-white border-4 border-black px-2 md:px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-xs md:text-sm flex items-center gap-1"
                >
                  <span>Generate a quiz on SQL basics</span>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
                <button
                  onClick={() => {
                    setMessage("Create a study plan for my database exam")
                  }}
                  className="bg-white border-4 border-black px-2 md:px-3 py-1 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all text-xs md:text-sm flex items-center gap-1"
                >
                  <span>Create a study plan for my database exam</span>
                  <ArrowRight className="h-3 w-3 md:h-4 md:w-4" />
                </button>
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="flex gap-3">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask MindNest AI anything..."
                  className="border-4 border-black h-12 md:h-14 text-sm md:text-lg font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 flex-1"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white border-4 border-black h-12 md:h-14 w-12 md:w-14 flex items-center justify-center shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
                >
                  <Send className="h-5 w-5 md:h-6 md:w-6" />
                </button>
              </form>
            </TabsContent>

            <TabsContent value="syllabus" className="flex-1 flex flex-col">
              <div className="bg-white border-8 border-black p-6 md:p-8 shadow-brutal h-full">
                <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 uppercase border-b-4 border-black pb-2">
                  SYLLABUS EXPLORER
                </h2>
                <p className="mb-6 md:mb-8 text-base md:text-lg">
                  Select a course to explore its syllabus with AI assistance.
                </p>

                <div className="space-y-4 md:space-y-5">
                  <div className="border-4 border-black p-4 md:p-5">
                    <div className="flex justify-between items-center cursor-pointer">
                      <h3 className="text-lg md:text-xl font-bold">Database Management Systems (CS401)</h3>
                      <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>

                  <div className="border-4 border-black p-4 md:p-5">
                    <div className="flex justify-between items-center cursor-pointer">
                      <h3 className="text-lg md:text-xl font-bold">Data Structures & Algorithms (CS402)</h3>
                      <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>

                  <div className="border-4 border-black p-4 md:p-5">
                    <div className="flex justify-between items-center cursor-pointer">
                      <h3 className="text-lg md:text-xl font-bold">Computer Networks (CS403)</h3>
                      <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>

                  <div className="border-4 border-black p-4 md:p-5">
                    <div className="flex justify-between items-center cursor-pointer">
                      <h3 className="text-lg md:text-xl font-bold">Operating Systems (CS404)</h3>
                      <ChevronDown className="h-5 w-5 md:h-6 md:w-6" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 md:mt-10 p-6 md:p-8 border-4 border-dashed border-black">
                  <h3 className="text-lg md:text-xl font-bold mb-4">AI Syllabus Assistant</h3>
                  <p className="mb-4 md:mb-6 text-sm md:text-base">
                    Ask questions about any course syllabus or compare topics across courses.
                  </p>
                  <div className="flex gap-3">
                    <Input
                      placeholder="Ask about syllabus topics..."
                      className="border-4 border-black h-10 md:h-12 font-mono shadow-brutal focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-blue-600 flex-1"
                    />
                    <button className="bg-fuchsia-500 text-white border-4 border-black h-10 md:h-12 px-4 flex items-center justify-center shadow-brutal hover:translate-y-1 hover:shadow-none transition-all">
                      <Send className="h-4 w-4 md:h-5 md:w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="flex-1 flex flex-col">
              <div className="bg-white border-8 border-black p-6 shadow-brutal h-full">
                <h2 className="text-xl md:text-2xl font-black mb-6 uppercase border-b-4 border-black pb-2">
                  NOTE ANALYZER
                </h2>
                <p className="mb-6 text-sm md:text-base">
                  Upload your notes for AI analysis, summaries, and quiz generation.
                </p>

                <div className="border-4 border-dashed border-black p-6 md:p-8 flex flex-col items-center justify-center">
                  <div className="h-12 w-12 md:h-16 md:w-16 bg-black flex items-center justify-center mb-4">
                    <PlusCircle className="h-6 w-6 md:h-8 md:w-8 text-white" />
                  </div>
                  <p className="text-base md:text-lg font-bold mb-2">DRAG & DROP FILES HERE</p>
                  <p className="text-sm mb-4">or click to browse</p>
                  <p className="text-xs text-gray-500">Supports PDF, DOCX, JPG, PNG (Max 10MB)</p>
                </div>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="border-4 border-black p-4">
                    <h3 className="text-lg font-bold mb-2">AFTER UPLOAD, I CAN:</h3>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-cyan-400"></div>
                        <span>Summarize key concepts</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-fuchsia-500"></div>
                        <span>Generate practice questions</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-yellow-500"></div>
                        <span>Create flashcards</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-blue-600"></div>
                        <span>Identify weak areas</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-black text-white border-4 border-black p-4">
                    <h3 className="text-lg font-bold mb-2">RECENT UPLOADS:</h3>
                    <p className="text-sm text-gray-400 italic">No recent uploads found.</p>
                    <button className="mt-4 bg-white text-black border-4 border-white px-3 py-1 font-bold shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all text-sm">
                      VIEW HISTORY
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}