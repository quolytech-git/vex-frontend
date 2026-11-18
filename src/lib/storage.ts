import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  disciplines: string[];
  engagementSize: string;
  plan?: string;
  decisionSummary: string;
  createdAt: string;
}

export interface NewsletterSubscription {
  id: string;
  email: string;
  createdAt: string;
}

interface SubmissionsStore {
  contacts: ContactSubmission[];
  newsletter: NewsletterSubscription[];
}

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "submissions.json");

async function readStore(): Promise<SubmissionsStore> {
  try {
    const raw = await readFile(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw) as Partial<SubmissionsStore>;
    return {
      contacts: Array.isArray(parsed.contacts) ? parsed.contacts : [],
      newsletter: Array.isArray(parsed.newsletter) ? parsed.newsletter : [],
    };
  } catch {
    return { contacts: [], newsletter: [] };
  }
}

async function writeStore(store: SubmissionsStore): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8");
}

export async function saveContactSubmission(
  input: Omit<ContactSubmission, "id" | "createdAt">
): Promise<ContactSubmission> {
  const store = await readStore();
  const entry: ContactSubmission = {
    id: crypto.randomUUID(),
    ...input,
    createdAt: new Date().toISOString(),
  };
  store.contacts.push(entry);
  await writeStore(store);
  return entry;
}

export async function saveNewsletterSubscription(
  email: string
): Promise<{ alreadySubscribed: boolean; entry: NewsletterSubscription }> {
  const store = await readStore();
  const normalized = email.trim().toLowerCase();
  const existing = store.newsletter.find(
    (item) => item.email.toLowerCase() === normalized
  );
  if (existing) {
    return { alreadySubscribed: true, entry: existing };
  }
  const entry: NewsletterSubscription = {
    id: crypto.randomUUID(),
    email: normalized,
    createdAt: new Date().toISOString(),
  };
  store.newsletter.push(entry);
  await writeStore(store);
  return { alreadySubscribed: false, entry };
}
