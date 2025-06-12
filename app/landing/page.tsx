"use client"

import { useState, useEffect } from "react"
import {
  Play,
  ArrowRight,
  Check,
  Star,
  BookOpen,
  BarChart3,
  FileText,
  Gem,
  ChevronDown,
  ChevronUp,
  Circle,
  Square,
  Brain,
  Network,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authService } from "@/lib/auth"

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const router = useRouter()

  useEffect(() => {
    if (authService.isAuthenticated()) {
      router.push("/dashboard")
    }
  }, [router])

  const testimonials = [
    {
      name: "Priya Sharma",
      course: "Computer Engineering, VJTI",
      rating: 5,
      text: "MindNest helped me organize my learning journey and ace my exams! The AI assistant is like having a personal tutor.",
      avatar: "PS",
    },
    {
      name: "Arjun Patel", 
      course: "Information Technology, SPIT",
      rating: 5,
      text: "It's like having a personal learning companion. MindNest makes studying actually enjoyable!",
      avatar: "AP",
    },
    {
      name: "Sneha Kulkarni",
      course: "Electronics & Telecom, DJ Sanghvi", 
      rating: 5,
      text: "The resource library and progress tracking saved my semester. Perfect for organized learning.",
      avatar: "SK",
    },
    {
      name: "Rohit Desai",
      course: "Mechanical Engineering, Thadomal Shahani",
      rating: 4,
      text: "Progress tracking keeps me motivated. Love seeing my learning streak grow every day!",
      avatar: "RD",
    },
  ]

  const faqs = [
    {
      question: "Is MindNest free to use?",
      answer:
        "Yes, MindNest is completely free for all students. We believe education should be accessible to everyone.",
    },
    {
      question: "Which universities is this for?",
      answer:
        "Currently, MindNest is designed for university students. We're planning to expand to more educational institutions soon.",
    },
    {
      question: "How does the AI assistant work?",
      answer:
        "MindNest AI is trained on educational content and can help with explanations, generate quizzes, create study plans, and answer subject-specific questions.",
    },
    {
      question: "Can I access my data offline?",
      answer:
        "Yes! MindNest works offline for most features. Your progress, notes, and downloaded resources are available even without internet.",
    },
    {
      question: "How do I get peer-shared notes?",
      answer:
        "During signup, you can opt-in to receive notes shared by students from your college and department. All content is moderated for quality.",
    },
    {
      question: "Is my academic data secure?",
      answer:
        "Absolutely. We use industry-standard encryption and never share your personal academic information with third parties.",
    },
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [testimonials.length])

  return (
    <div className={`min-h-screen font-mono ${darkMode ? "dark" : ""}`}>
      <div className="bg-background text-foreground">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b-8 border-black bg-primary">
          <div className="container flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
            <div className="flex items-center gap-6">
              <div className="flex items-center">
                <div className="h-8 w-8 md:h-12 md:w-12 bg-yellow-500 border-4 border-black rotate-12 flex items-center justify-center">
                  <Brain className="h-4 w-4 md:h-6 md:w-6 text-black" />
                </div>
                <div className="h-8 w-8 md:h-12 md:w-12 bg-blue-600 border-4 border-black -ml-4 md:-ml-6 -rotate-12 flex items-center justify-center">
                  <Network className="h-4 w-4 md:h-6 md:w-6 text-white" />
                </div>
                <span className="font-black text-lg md:text-2xl tracking-tighter ml-3 md:ml-4 text-white">MINDNEST</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="bg-white border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
              >
                LOGIN
              </Link>
              <Link
                href="/signup"
                className="bg-yellow-500 border-4 border-black px-4 py-2 font-bold shadow-brutal hover:translate-y-1 hover:shadow-none transition-all"
              >
                SIGN UP
              </Link>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="h-10 w-10 bg-white border-4 border-black flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                {darkMode ? <Circle className="h-5 w-5" /> : <Square className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-red-600 via-blue-600 to-yellow-500 border-b-8 border-black">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative container mx-auto px-4 md:px-6 py-16 md:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-white leading-tight">
                    ORGANIZE YOUR
                    <br />
                    LEARNING JOURNEY
                  </h1>
                  <div className="flex gap-3 items-center">
                    <div className="h-6 w-6 bg-white"></div>
                    <div className="h-6 w-6 bg-white"></div>
                    <div className="h-6 w-6 bg-white"></div>
                  </div>
                  <p className="text-xl md:text-2xl font-bold text-white">SMART STUDY TOOLS & AI ASSISTANCE</p>
                  <p className="text-lg md:text-xl text-white font-bold">
                    Track progress, find resources, boost performance — in one place.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/signup"
                    className="bg-yellow-500 text-black border-4 border-black px-8 py-4 font-black text-lg md:text-xl shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    GET STARTED
                    <ArrowRight className="h-6 w-6" />
                  </Link>
                  <button className="bg-white text-black border-4 border-black px-8 py-4 font-black text-lg md:text-xl shadow-brutal hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2">
                    <Play className="h-6 w-6" />
                    WATCH DEMO
                  </button>
                </div>

                <div className="bg-white border-4 border-black p-4 shadow-brutal">
                  <p className="font-bold text-black">✅ 100% FREE • ✅ AI POWERED • ✅ 1,000+ STUDENTS</p>
                </div>
              </div>

              <div className="relative">
                <div className="bg-white border-8 border-black p-4 shadow-brutal transform rotate-2">
                  <div className="bg-gray-200 border-4 border-black h-80 md:h-96 flex items-center justify-center">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-4">
                        <div className="h-12 w-12 bg-red-600 border-4 border-black flex items-center justify-center">
                          <Target className="h-6 w-6 text-white" />
                        </div>
                        <div className="h-12 w-12 bg-blue-600 border-4 border-black -ml-6 flex items-center justify-center">
                          <Brain className="h-6 w-6 text-white" />
                        </div>
                        <div className="h-12 w-12 bg-yellow-500 border-4 border-black -ml-6 flex items-center justify-center">
                          <Network className="h-6 w-6 text-black" />
                        </div>
                      </div>
                      <h3 className="text-xl font-black">MINDNEST DASHBOARD</h3>
                      <p className="font-bold">Progress • Resources • AI</p>
                    </div>
                  </div>
                </div>
                <div className="absolute -bottom-4 -right-4 bg-black text-white border-4 border-black p-4 shadow-brutal transform -rotate-2">
                  <p className="font-bold">BUILT WITH BOLT.NEW!</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-white border-b-8 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">YOUR LEARNING COMPANION</h2>
              <div className="flex justify-center gap-3 mb-6">
                <div className="h-6 w-6 bg-red-600"></div>
                <div className="h-6 w-6 bg-blue-600"></div>
                <div className="h-6 w-6 bg-yellow-500"></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-red-600 text-white border-8 border-black p-6 shadow-brutal">
                <div className="mb-4">
                  <BookOpen className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 uppercase">TRACK YOUR PROGRESS</h3>
                <p className="font-bold">
                  Live course completion, assignments & progress analytics tailored for your curriculum.
                </p>
              </div>

              <div className="bg-blue-600 text-white border-8 border-black p-6 shadow-brutal">
                <div className="mb-4">
                  <FileText className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 uppercase">SMART RESOURCES</h3>
                <p className="font-bold">
                  Curated study materials, PDFs, videos & notes shared by students from your college.
                </p>
              </div>

              <div className="bg-yellow-500 text-black border-8 border-black p-6 shadow-brutal">
                <div className="mb-4">
                  <Gem className="h-12 w-12 text-black" />
                </div>
                <h3 className="text-xl font-black mb-3 uppercase">AI HELP ON DEMAND</h3>
                <p className="font-bold">
                  Ask questions, generate answers & summaries with MindNest AI trained on educational content.
                </p>
              </div>

              <div className="bg-black text-white border-8 border-black p-6 shadow-brutal">
                <div className="mb-4">
                  <BarChart3 className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3 uppercase">SMART ANALYTICS</h3>
                <p className="font-bold">
                  Performance heatmaps, study streaks, and personalized insights to boost grades.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why MindNest Section */}
        <section className="py-16 md:py-24 bg-black text-white border-b-8 border-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8">WHY MINDNEST?</h2>
            <p className="text-xl md:text-2xl font-bold mb-12">Built with bolt.new for modern learners.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="bg-white text-black border-4 border-white p-6">
                <Check className="h-8 w-8 mx-auto mb-3" />
                <p className="font-bold">AI POWERED</p>
              </div>
              <div className="bg-white text-black border-4 border-white p-6">
                <Check className="h-8 w-8 mx-auto mb-3" />
                <p className="font-bold">NO DISTRACTIONS</p>
              </div>
              <div className="bg-white text-black border-4 border-white p-6">
                <Check className="h-8 w-8 mx-auto mb-3" />
                <p className="font-bold">OFFLINE-FRIENDLY</p>
              </div>
              <div className="bg-white text-black border-4 border-white p-6">
                <Check className="h-8 w-8 mx-auto mb-3" />
                <p className="font-bold">1,000+ STUDENTS</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-cyan-400 to-fuchsia-500 border-b-8 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4 text-white">
                STUDENT VOICES
              </h2>
              <p className="text-xl font-bold text-white">What students are saying about MindNest</p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="bg-white border-8 border-black p-8 shadow-brutal">
                <div className="text-center mb-6">
                  <div className="flex justify-center gap-1 mb-4">
                    {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                      <Star key={i} className="h-6 w-6 fill-yellow-500 text-yellow-500" />
                    ))}
                  </div>
                  <blockquote className="text-xl md:text-2xl font-bold mb-6">
                    "{testimonials[currentTestimonial].text}"
                  </blockquote>
                  <div className="flex items-center justify-center gap-4">
                    <div className="h-12 w-12 bg-blue-600 border-4 border-black flex items-center justify-center text-white font-black">
                      {testimonials[currentTestimonial].avatar}
                    </div>
                    <div className="text-left">
                      <p className="font-black">{testimonials[currentTestimonial].name}</p>
                      <p className="font-bold text-gray-600">{testimonials[currentTestimonial].course}</p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`h-4 w-4 border-2 border-black ${
                        index === currentTestimonial ? "bg-blue-600" : "bg-white"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-white border-b-8 border-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-4">FREQUENTLY ASKED</h2>
              <p className="text-xl font-bold">Got questions? We've got answers.</p>
            </div>

            <div className="max-w-3xl mx-auto space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white border-4 border-black shadow-brutal">
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="w-full p-6 text-left font-bold text-lg flex justify-between items-center hover:bg-gray-50 transition-colors"
                  >
                    {faq.question}
                    {openFaq === index ? <ChevronUp className="h-6 w-6" /> : <ChevronDown className="h-6 w-6" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 border-t-4 border-black">
                      <p className="font-bold text-gray-700 pt-4">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24 bg-black text-white">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase mb-8">
              READY TO ORGANIZE YOUR LEARNING?
            </h2>
            <p className="text-xl md:text-2xl font-bold mb-12">
              Join 1,000+ students already using MindNest
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-md mx-auto">
              <Link
                href="/signup"
                className="bg-yellow-500 text-black border-4 border-white px-8 py-4 font-black text-lg shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                START USING MINDNEST FOR FREE
                <ArrowRight className="h-6 w-6" />
              </Link>
              <Link
                href="/login"
                className="bg-white text-black border-4 border-white px-8 py-4 font-black text-lg shadow-brutal-white hover:translate-y-1 hover:shadow-none transition-all"
              >
                EXPLORE FEATURES
              </Link>
            </div>

            <div className="mt-12 pt-8 border-t-4 border-white">
              <p className="font-bold text-gray-300">Made with ❤️ using bolt.new</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-white border-t-8 border-black py-8">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-yellow-500 border-4 border-black rotate-12 flex items-center justify-center">
                  <Brain className="h-4 w-4 text-black" />
                </div>
                <div className="h-8 w-8 bg-blue-600 border-4 border-black -ml-4 -rotate-12 flex items-center justify-center">
                  <Network className="h-4 w-4 text-white" />
                </div>
                <span className="font-black text-xl tracking-tighter ml-3">MINDNEST</span>
              </div>
              <div className="flex gap-6">
                <Link href="/privacy" className="font-bold hover:underline">
                  Privacy Policy
                </Link>
                <Link href="/terms" className="font-bold hover:underline">
                  Terms of Service
                </Link>
                <Link href="/contact" className="font-bold hover:underline">
                  Contact
                </Link>
              </div>
              <p className="font-bold text-gray-600">© 2024 MindNest. Built with bolt.new</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}