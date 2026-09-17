import { contentList } from "@/lib/generator/content";
import {
  avatarUrl,
  createRng,
  emailFromName,
  fullName,
  fullNameByGender,
  id,
  int,
  isoDate,
  moneyAmount,
  phone,
  place,
  takeFields,
  usernameFromName,
  pick,
} from "@/lib/generator/helpers";
import type { GeneratorTopic } from "@/lib/generator/types";
import {
  Users,
  UserRound,
  BriefcaseBusiness,
  PenLine,
  Contact,
  UsersRound,
  Stethoscope,
  HeartPulse,
  CarFront,
  ConciergeBell,
  CircleUserRound,
  GraduationCap,
  School,
  BookMarked,
} from "lucide-react";

const ROLES = {
  en: ["admin", "member", "viewer", "editor"] as const,
  fa: ["admin", "member", "viewer", "editor"] as const,
};

const SPECIALTIES = {
  en: [
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Orthopedics",
    "Neurology",
    "General Practice",
  ] as const,
  fa: [
    "قلب",
    "پوست",
    "اطفال",
    "ارتوپدی",
    "مغز و اعصاب",
    "عمومی",
  ] as const,
};

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;

const VEHICLE_TYPES = {
  en: ["sedan", "suv", "van", "motorcycle", "truck"] as const,
  fa: ["سواری", "شاسی‌بلند", "ون", "موتورسیکلت", "کامیونت"] as const,
};

const GUEST_STATUSES = {
  en: ["checked_in", "reserved", "checked_out", "cancelled"] as const,
  fa: ["ورود کرده", "رزرو شده", "خروج کرده", "لغو شده"] as const,
};

const SUBJECTS = {
  en: [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Literature",
    "History",
    "Computer Science",
    "Biology",
    "Art",
  ] as const,
  fa: [
    "ریاضی",
    "فیزیک",
    "شیمی",
    "ادبیات",
    "تاریخ",
    "علوم کامپیوتر",
    "زیست‌شناسی",
    "هنر",
  ] as const,
};

const GRADES = {
  en: ["9", "10", "11", "12"] as const,
  fa: ["نهم", "دهم", "یازدهم", "دوازدهم"] as const,
};

const TEAM_ROLES = {
  en: ["lead", "member", "contributor", "intern"] as const,
  fa: ["سرپرست", "عضو", "همکار", "کارآموز"] as const,
};

export const peopleTopics: GeneratorTopic[] = [
  {
    id: "users",
    category: "people",
    icon: Users,
    fields: [
      { id: "name", default: true },
      { id: "username", default: true },
      { id: "email", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "phone", default: false },
      { id: "company", default: false },
      { id: "location", default: false },
      { id: "age", default: false },
      { id: "role", default: false },
      { id: "bio", default: false },
      { id: "website", default: false },
      { id: "createdAt", default: false },
      { id: "country", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("usr", ctx.index, rng),
        name,
        username: usernameFromName(name, rng),
        email: emailFromName(name, rng),
        avatar: avatarUrl(`${ctx.seed}-${ctx.index}`),
        phone: phone(ctx.pack, rng),
        company: pick(rng, ctx.pack.companies),
        location: `${loc.city}, ${loc.region}`,
        age: int(rng, 18, 65),
        role: pick(rng, ROLES[ctx.uiLocale]),
        bio: pick(rng, contentList("bios", ctx.uiLocale)),
        website: `https://example.com/u/${usernameFromName(name, rng)}`,
        createdAt: isoDate(rng, 400),
        country: ctx.pack.countryName,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "customers",
    category: "people",
    icon: UserRound,
    fields: [
      { id: "name", default: true },
      { id: "email", default: true },
      { id: "avatar", default: true },
      { id: "phone", default: true },
      { id: "id", default: false },
      { id: "location", default: false },
      { id: "company", default: false },
      { id: "country", default: false },
      { id: "ordersCount", default: false },
      { id: "totalSpent", default: false },
      { id: "createdAt", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("cus", ctx.index, rng),
        name,
        email: emailFromName(name, rng),
        avatar: avatarUrl(`cus-${ctx.seed}-${ctx.index}`),
        phone: phone(ctx.pack, rng),
        location: `${loc.city}, ${ctx.pack.countryName}`,
        company: pick(rng, ctx.pack.companies),
        country: ctx.pack.countryName,
        ordersCount: int(rng, 0, 48),
        totalSpent: moneyAmount(rng, ctx.uiLocale, {
          fa: [0, 50_000_000],
          en: [0, 5000],
        }),
        createdAt: isoDate(rng, 500),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "employees",
    category: "people",
    icon: BriefcaseBusiness,
    fields: [
      { id: "name", default: true },
      { id: "jobTitle", default: true },
      { id: "department", default: true },
      { id: "company", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "location", default: false },
      { id: "email", default: false },
      { id: "phone", default: false },
      { id: "country", default: false },
      { id: "hiredAt", default: false },
      { id: "salary", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("emp", ctx.index, rng),
        name,
        jobTitle: pick(rng, contentList("jobTitles", ctx.uiLocale)),
        department: pick(rng, contentList("departments", ctx.uiLocale)),
        company: pick(rng, ctx.pack.companies),
        avatar: avatarUrl(`emp-${ctx.seed}-${ctx.index}`),
        location: `${loc.city}, ${loc.region}`,
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        country: ctx.pack.countryName,
        hiredAt: isoDate(rng, 1200),
        salary: moneyAmount(rng, ctx.uiLocale, {
          fa: [8_000_000, 85_000_000],
          en: [42_000, 165_000],
        }),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "authors",
    category: "people",
    icon: PenLine,
    fields: [
      { id: "name", default: true },
      { id: "avatar", default: true },
      { id: "bio", default: true },
      { id: "email", default: true },
      { id: "id", default: false },
      { id: "website", default: false },
      { id: "location", default: false },
      { id: "country", default: false },
      { id: "postsCount", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const record: Record<string, unknown> = {
        id: id("aut", ctx.index, rng),
        name,
        avatar: avatarUrl(`aut-${ctx.seed}-${ctx.index}`),
        bio: pick(rng, contentList("bios", ctx.uiLocale)),
        email: emailFromName(name, rng),
        website: `https://${usernameFromName(name, rng)}.dev`,
        location: `${loc.city}, ${ctx.pack.countryName}`,
        country: ctx.pack.countryName,
        postsCount: int(rng, 1, 120),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "contacts",
    category: "people",
    icon: Contact,
    fields: [
      { id: "name", default: true },
      { id: "email", default: true },
      { id: "phone", default: true },
      { id: "company", default: true },
      { id: "id", default: false },
      { id: "jobTitle", default: false },
      { id: "avatar", default: false },
      { id: "location", default: false },
      { id: "notes", default: false },
      { id: "createdAt", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const notes =
        ctx.uiLocale === "fa"
          ? ["پیگیری هفته بعد", "معرفی شده توسط همکار", "اولویت بالا", "تماسی نداشته"]
          : ["Follow up next week", "Referred by teammate", "High priority", "No contact yet"];
      const record: Record<string, unknown> = {
        id: id("cnt", ctx.index, rng),
        name,
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        company: pick(rng, ctx.pack.companies),
        jobTitle: pick(rng, contentList("jobTitles", ctx.uiLocale)),
        avatar: avatarUrl(`cnt-${ctx.seed}-${ctx.index}`),
        location: `${loc.city}, ${loc.region}`,
        notes: pick(rng, notes),
        createdAt: isoDate(rng, 400),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "team-members",
    category: "people",
    icon: UsersRound,
    fields: [
      { id: "name", default: true },
      { id: "role", default: true },
      { id: "team", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "email", default: false },
      { id: "department", default: false },
      { id: "joinedAt", default: false },
      { id: "skills", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const teams =
        ctx.uiLocale === "fa"
          ? ["محصول", "طراحی", "مهندسی", "رشد", "پشتیبانی"]
          : ["Product", "Design", "Engineering", "Growth", "Support"];
      const skills =
        ctx.uiLocale === "fa"
          ? ["React", "TypeScript", "Figma", "SQL", "Node"]
          : ["React", "TypeScript", "Figma", "SQL", "Node"];
      const record: Record<string, unknown> = {
        id: id("tm", ctx.index, rng),
        name,
        role: pick(rng, TEAM_ROLES[ctx.uiLocale]),
        team: pick(rng, teams),
        avatar: avatarUrl(`tm-${ctx.seed}-${ctx.index}`),
        email: emailFromName(name, rng),
        department: pick(rng, contentList("departments", ctx.uiLocale)),
        joinedAt: isoDate(rng, 900),
        skills: [pick(rng, skills), pick(rng, skills)],
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "doctors",
    category: "people",
    icon: Stethoscope,
    fields: [
      { id: "name", default: true },
      { id: "specialty", default: true },
      { id: "hospital", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "email", default: false },
      { id: "phone", default: false },
      { id: "licenseNumber", default: false },
      { id: "yearsExperience", default: false },
      { id: "location", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const hospitals =
        ctx.uiLocale === "fa"
          ? ["بیمارستان سینا", "مرکز طبی آریا", "کلینیک نور", "بیمارستان پارس"]
          : ["City General", "Riverside Clinic", "North Medical", "Harbor Hospital"];
      const record: Record<string, unknown> = {
        id: id("doc", ctx.index, rng),
        name,
        specialty: pick(rng, SPECIALTIES[ctx.uiLocale]),
        hospital: pick(rng, hospitals),
        avatar: avatarUrl(`doc-${ctx.seed}-${ctx.index}`),
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        licenseNumber: `MD-${int(rng, 100000, 999999)}`,
        yearsExperience: int(rng, 2, 35),
        location: `${loc.city}, ${ctx.pack.countryName}`,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "patients",
    category: "people",
    icon: HeartPulse,
    fields: [
      { id: "name", default: true },
      { id: "age", default: true },
      { id: "bloodType", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "email", default: false },
      { id: "phone", default: false },
      { id: "diagnosis", default: false },
      { id: "doctor", default: false },
      { id: "admittedAt", default: false },
      { id: "location", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const diagnoses =
        ctx.uiLocale === "fa"
          ? ["فشار خون", "دیابت نوع ۲", "میگرن", "آسم", "کم‌خونی"]
          : ["Hypertension", "Type 2 diabetes", "Migraine", "Asthma", "Anemia"];
      const record: Record<string, unknown> = {
        id: id("pat", ctx.index, rng),
        name,
        age: int(rng, 1, 92),
        bloodType: pick(rng, BLOOD_TYPES),
        avatar: avatarUrl(`pat-${ctx.seed}-${ctx.index}`),
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        diagnosis: pick(rng, diagnoses),
        doctor: fullName(ctx.pack, rng),
        admittedAt: isoDate(rng, 180),
        location: `${loc.city}, ${loc.region}`,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "drivers",
    category: "people",
    icon: CarFront,
    fields: [
      { id: "name", default: true },
      { id: "vehicleType", default: true },
      { id: "plateNumber", default: true },
      { id: "rating", default: true },
      { id: "id", default: false },
      { id: "phone", default: false },
      { id: "avatar", default: false },
      { id: "tripsCount", default: false },
      { id: "licenseNumber", default: false },
      { id: "location", default: false },
      { id: "active", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const faLetters = ["ب", "ج", "د", "س", "ص", "ط", "ق", "ل", "م", "ن", "و", "ه", "ی"] as const;
      const plate =
        ctx.uiLocale === "fa"
          ? `${int(rng, 11, 99)}${pick(rng, faLetters)}${int(rng, 100, 999)}-${int(rng, 10, 99)}`
          : `${String.fromCharCode(65 + int(rng, 0, 25))}${String.fromCharCode(65 + int(rng, 0, 25))}-${int(rng, 1000, 9999)}`;
      const record: Record<string, unknown> = {
        id: id("drv", ctx.index, rng),
        name,
        vehicleType: pick(rng, VEHICLE_TYPES[ctx.uiLocale]),
        plateNumber: plate,
        rating: Number((3.5 + rng() * 1.5).toFixed(1)),
        phone: phone(ctx.pack, rng),
        avatar: avatarUrl(`drv-${ctx.seed}-${ctx.index}`),
        tripsCount: int(rng, 20, 8500),
        licenseNumber: `DL-${int(rng, 100000, 999999)}`,
        location: `${loc.city}, ${loc.region}`,
        active: rng() > 0.25,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "guests",
    category: "people",
    icon: ConciergeBell,
    fields: [
      { id: "name", default: true },
      { id: "email", default: true },
      { id: "roomNumber", default: true },
      { id: "status", default: true },
      { id: "id", default: false },
      { id: "phone", default: false },
      { id: "checkIn", default: false },
      { id: "checkOut", default: false },
      { id: "nights", default: false },
      { id: "country", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const nights = int(rng, 1, 14);
      const record: Record<string, unknown> = {
        id: id("gst", ctx.index, rng),
        name,
        email: emailFromName(name, rng),
        roomNumber: String(int(rng, 101, 899)),
        status: pick(rng, GUEST_STATUSES[ctx.uiLocale]),
        phone: phone(ctx.pack, rng),
        checkIn: isoDate(rng, 60),
        checkOut: isoDate(rng, 30),
        nights,
        country: ctx.pack.countryName,
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "profiles",
    category: "people",
    icon: CircleUserRound,
    fields: [
      { id: "name", default: true },
      { id: "username", default: true },
      { id: "avatar", default: true },
      { id: "bio", default: true },
      { id: "id", default: false },
      { id: "email", default: false },
      { id: "followers", default: false },
      { id: "following", default: false },
      { id: "website", default: false },
      { id: "location", default: false },
      { id: "verified", default: false },
      { id: "createdAt", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const loc = place(ctx.pack, rng);
      const username = usernameFromName(name, rng);
      const record: Record<string, unknown> = {
        id: id("prf", ctx.index, rng),
        name,
        username,
        avatar: avatarUrl(`prf-${ctx.seed}-${ctx.index}`),
        bio: pick(rng, contentList("bios", ctx.uiLocale)),
        email: emailFromName(name, rng),
        followers: int(rng, 0, 120_000),
        following: int(rng, 10, 2500),
        website: `https://example.com/@${username}`,
        location: `${loc.city}, ${ctx.pack.countryName}`,
        verified: rng() > 0.7,
        createdAt: isoDate(rng, 800),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "girl-students",
    category: "people",
    icon: GraduationCap,
    fields: [
      { id: "name", default: true },
      { id: "grade", default: true },
      { id: "school", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "age", default: false },
      { id: "email", default: false },
      { id: "gpa", default: false },
      { id: "major", default: false },
      { id: "enrollmentYear", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullNameByGender(ctx.pack, rng, ctx.uiLocale, "female");
      const schools =
        ctx.uiLocale === "fa"
          ? ["دبیرستان فرزانگان", "هنرستان الزهرا", "مدرسه روشن", "لیسه دانش"]
          : ["Lincoln High", "Riverside Academy", "Oakwood School", "North High"];
      const majors =
        ctx.uiLocale === "fa"
          ? ["ریاضی", "تجربی", "انسانی", "هنر"]
          : ["STEM", "Science", "Humanities", "Arts"];
      const record: Record<string, unknown> = {
        id: id("gs", ctx.index, rng),
        name,
        grade: pick(rng, GRADES[ctx.uiLocale]),
        school: pick(rng, schools),
        avatar: avatarUrl(`gs-${ctx.seed}-${ctx.index}`),
        age: int(rng, 14, 18),
        email: emailFromName(name, rng),
        gpa: Number((2.5 + rng() * 1.5).toFixed(2)),
        major: pick(rng, majors),
        enrollmentYear: int(rng, 2020, 2025),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "boy-students",
    category: "people",
    icon: School,
    fields: [
      { id: "name", default: true },
      { id: "grade", default: true },
      { id: "school", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "age", default: false },
      { id: "email", default: false },
      { id: "gpa", default: false },
      { id: "major", default: false },
      { id: "enrollmentYear", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullNameByGender(ctx.pack, rng, ctx.uiLocale, "male");
      const schools =
        ctx.uiLocale === "fa"
          ? ["دبیرستان علامه", "هنرستان شهید بهشتی", "مدرسه آفاق", "لیسه پویا"]
          : ["Jefferson High", "Westfield Academy", "Summit School", "Central High"];
      const majors =
        ctx.uiLocale === "fa"
          ? ["ریاضی", "تجربی", "انسانی", "فنی"]
          : ["STEM", "Science", "Humanities", "Vocational"];
      const record: Record<string, unknown> = {
        id: id("bs", ctx.index, rng),
        name,
        grade: pick(rng, GRADES[ctx.uiLocale]),
        school: pick(rng, schools),
        avatar: avatarUrl(`bs-${ctx.seed}-${ctx.index}`),
        age: int(rng, 14, 18),
        email: emailFromName(name, rng),
        gpa: Number((2.5 + rng() * 1.5).toFixed(2)),
        major: pick(rng, majors),
        enrollmentYear: int(rng, 2020, 2025),
      };
      return takeFields(record, fields);
    },
  },
  {
    id: "teachers",
    category: "people",
    icon: BookMarked,
    fields: [
      { id: "name", default: true },
      { id: "subject", default: true },
      { id: "school", default: true },
      { id: "avatar", default: true },
      { id: "id", default: false },
      { id: "email", default: false },
      { id: "phone", default: false },
      { id: "yearsExperience", default: false },
      { id: "classesCount", default: false },
      { id: "department", default: false },
    ],
    generateOne(ctx, fields) {
      const rng = createRng(ctx.seed, ctx.index);
      const name = fullName(ctx.pack, rng);
      const schools =
        ctx.uiLocale === "fa"
          ? ["دبیرستان نمونه", "مدرسه هوشمند", "لیسه ملی", "آموزشگاه پارس"]
          : ["Lincoln High", "Riverside Academy", "Oakwood School", "North High"];
      const departments =
        ctx.uiLocale === "fa"
          ? ["علوم", "ریاضی", "زبان", "علوم انسانی"]
          : ["Science", "Math", "Languages", "Humanities"];
      const record: Record<string, unknown> = {
        id: id("tch", ctx.index, rng),
        name,
        subject: pick(rng, SUBJECTS[ctx.uiLocale]),
        school: pick(rng, schools),
        avatar: avatarUrl(`tch-${ctx.seed}-${ctx.index}`),
        email: emailFromName(name, rng),
        phone: phone(ctx.pack, rng),
        yearsExperience: int(rng, 1, 30),
        classesCount: int(rng, 2, 8),
        department: pick(rng, departments),
      };
      return takeFields(record, fields);
    },
  },
];
