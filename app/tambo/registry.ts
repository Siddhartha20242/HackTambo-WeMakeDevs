import dynamic from 'next/dynamic';
import { 
  PomodoroSchema, 
  GradeSchema, 
  LeetCodeSchema, 
  ResourceSchema 
} from "@/lib/schema";

const PomodoroTimer = dynamic(() => import("../components/tools/PomodoroTimer"));
const GradeCalculator = dynamic(() => import("../components/tools/GradeCalculator"));
const LeetCodeLive = dynamic(() => import("../components/tools/LeetCodeLive"));
const ResourceLibrary = dynamic(() => import("../components/tools/ResourceLibrary"));
export const COMPONENT_REGISTRY = {
  "pomodoro": {
    name: "Focus Session",
    Component: PomodoroTimer,
    schema: PomodoroSchema,
    description: "Triggers when Siddhartha needs to focus on a specific task."
  },
  "grade-calc": {
    name: "Academic Tracker",
    Component: GradeCalculator,
    schema: GradeSchema,
    description: "Triggers when discussing GPA, grades, or semester progress."
  },
  "leetcode": {
    name: "Coding Environment",
    Component: LeetCodeLive,
    schema: LeetCodeSchema,
    description: "Triggers during active coding or LeetCode problem solving."
  },
  "resources": {
    name: "Study Materials",
    Component: ResourceLibrary,
    schema: ResourceSchema,
    description: "Triggers when Siddhartha needs specific PDFs or notes for CSIT."
  }
} as const;

export type RegistryKey = keyof typeof COMPONENT_REGISTRY;