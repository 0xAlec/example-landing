import type { StaticImageData } from "next/image";

import alexPortrait from "@/assets/people/alex.jpg";
import samPortrait from "@/assets/people/sam.jpg";
import jamiePortrait from "@/assets/people/jamie.jpg";
import noriPortrait from "@/assets/nori/portraits/nori.webp";
import mossPortrait from "@/assets/nori/portraits/moss.webp";
import quillPortrait from "@/assets/nori/portraits/quill.webp";

type Participant = { name: string; portrait: StaticImageData };
export type ReviewRequest = {
  number: number;
  title: string;
  author: Participant;
  crew: Participant;
  codingAssistant: { name: string; logo: string };
  age: string;
  repository: string;
  added: number;
  removed: number;
  checks: "passed" | "failed" | "pending";
};

const alex = { name: "Alex", portrait: alexPortrait };
const sam = { name: "Sam", portrait: samPortrait };
const jamie = { name: "Jamie", portrait: jamiePortrait };
const nori = { name: "Nori", portrait: noriPortrait };
const moss = { name: "Moss", portrait: mossPortrait };
const quill = { name: "Quill", portrait: quillPortrait };
const codex = { name: "Codex", logo: "openai.svg" };
const cursor = { name: "Cursor", logo: "cursor.svg" };
const claude = { name: "Claude Code", logo: "claude.svg" };

const approvedRequests: ReviewRequest[] = [
  {
    number: 1281, title: "feat: add CSV exports", author: sam, crew: moss, codingAssistant: cursor,
    age: "6 hours ago", repository: "api", added: 412, removed: 138, checks: "passed",
  },
  {
    number: 1284, title: "fix: handle expired sign-in links", author: alex, crew: quill, codingAssistant: codex,
    age: "3 hours ago", repository: "web-app", added: 43, removed: 11, checks: "failed",
  },
  {
    number: 1279, title: "fix: preserve dashboard filters", author: jamie, crew: quill, codingAssistant: claude,
    age: "8 hours ago", repository: "web-app", added: 88, removed: 6, checks: "passed",
  },
  {
    number: 1275, title: "feat: add account notifications", author: alex, crew: nori, codingAssistant: codex,
    age: "9 hours ago", repository: "web-app", added: 24, removed: 3, checks: "passed",
  },
];

const needsReviewRequests: ReviewRequest[] = [
  {
    number: 1287, title: "feat: add team invitations", author: jamie, crew: nori, codingAssistant: cursor,
    age: "1 hour ago", repository: "web-app", added: 126, removed: 8, checks: "passed",
  },
  {
    number: 1286, title: "fix: retry failed webhook deliveries", author: sam, crew: moss, codingAssistant: claude,
    age: "2 hours ago", repository: "api", added: 64, removed: 12, checks: "passed",
  },
  {
    number: 1285, title: "fix: restore focus after search", author: alex, crew: quill, codingAssistant: codex,
    age: "2 hours ago", repository: "web-app", added: 32, removed: 7, checks: "passed",
  },
];

const draftRequests: ReviewRequest[] = [
  {
    number: 1289, title: "feat: add saved views", author: alex, crew: nori, codingAssistant: claude,
    age: "20 minutes ago", repository: "web-app", added: 96, removed: 4, checks: "pending",
  },
  {
    number: 1288, title: "feat: add usage reports", author: sam, crew: moss, codingAssistant: cursor,
    age: "45 minutes ago", repository: "api", added: 158, removed: 16, checks: "pending",
  },
];

export const reviewGroups = [
  { id: "approved", label: "Approved", requests: approvedRequests },
  { id: "review", label: "Needs review", requests: needsReviewRequests },
  { id: "draft", label: "Draft", requests: draftRequests },
];
