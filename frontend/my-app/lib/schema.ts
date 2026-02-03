import {z} from 'zod';

export const PomodoroSchema = z.object({
    workDuration: z.number().min(1).max(60).default(25),
    breakDuration: z.number().min(1).max(20).default(5),
    taskName: z.string().min(1, "What are you studying?").max(100),
    theme: z.enum(["galatic", "minimal", "forest"]).default("galatic"),

});


export const SubjectSchema = z.object({
    name: z.string(),
    credits: z.number().min(1).max(4),
    grade: z.string().optional(),
})


export const GradeSchema = z.object({
   semster: z.number().min(1).max(0).default(1),
   subjects: z.array(SubjectSchema).default([
    {name: "Digital Logic", credits: 3},
    {name: "C Programming", credits: 3},
    {name: "Mathematics I", credits: 3},
    {name: "Physics", credits: 3},
    {name: "IIT", credits: 3},
    
   ]),
   targetGpa: z.number().min(0).max(4.0).default(4.0)
})

export const LeetCodeSchema = z.object({
    problemId: z.string(),
    problemTitle: z.string(),
    difficulty: z.enum(["Easy", "Medium", "Hard"]),
    langauge: z.enum(["Python", "typescript", "cpp", "Java"]).default("Python"),
    initialCode: z.string().optional(),
    showHints: z.boolean().default(true),
});


export const ResourceSchema = z.object({
    subject: z.string(),
    resourceType: z.enum(["PDF", "Video", "Article"]),
    links: z.array(z.object({
        title: z.string(),
        url: z.string().startsWith("http", "Link must be valid URL (http/https)")
    })),
    recommendedTime: z.number().optional(),
});

export type ResourceSchema = z.infer<typeof ResourceSchema>;
export type LeetCodeSchema = z.infer<typeof LeetCodeSchema>;
export type PomodoroSchema = z.infer<typeof PomodoroSchema>;
export type GradeSchema = z.infer <typeof GradeSchema>;
export type SubjectSchema = z.infer <typeof SubjectSchema>;


export const ComponentTypeEnum = z.enum([
    "POMODORO",
    "GRADE_CALC",
    "LEETCODE_LIVE",
    "LOGIC_GATE",
]);

export type ComponentType = z.infer <typeof ComponentTypeEnum>;








































