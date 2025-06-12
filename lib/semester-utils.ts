export interface YearSemesterMapping {
  year: string
  yearLabel: string
  semesters: number[]
  semesterLabels: string[]
}

export const YEAR_SEMESTER_MAPPING: YearSemesterMapping[] = [
  {
    year: "FY",
    yearLabel: "First Year",
    semesters: [1, 2],
    semesterLabels: ["Semester I", "Semester II"],
  },
  {
    year: "SY",
    yearLabel: "Second Year",
    semesters: [3, 4],
    semesterLabels: ["Semester III", "Semester IV"],
  },
  {
    year: "TY",
    yearLabel: "Third Year",
    semesters: [5, 6],
    semesterLabels: ["Semester V", "Semester VI"],
  },
  {
    year: "BE",
    yearLabel: "Final Year",
    semesters: [7, 8],
    semesterLabels: ["Semester VII", "Semester VIII"],
  },
]

export function getUserAvailableSemesters(userYear: string): YearSemesterMapping | null {
  return YEAR_SEMESTER_MAPPING.find((mapping) => mapping.year === userYear) || null
}

export function getSemesterLabel(semesterNumber: number): string {
  for (const mapping of YEAR_SEMESTER_MAPPING) {
    const index = mapping.semesters.indexOf(semesterNumber)
    if (index !== -1) {
      return mapping.semesterLabels[index]
    }
  }
  return `Semester ${semesterNumber}`
}

export function getYearFromSemester(semesterNumber: number): string {
  for (const mapping of YEAR_SEMESTER_MAPPING) {
    if (mapping.semesters.includes(semesterNumber)) {
      return mapping.year
    }
  }
  return "FY"
}

export function mapUserYearToSemesters(yearOfStudy: string): number[] {
  const mapping = getUserAvailableSemesters(yearOfStudy)
  return mapping ? mapping.semesters : [1, 2] // Default to FY
}
