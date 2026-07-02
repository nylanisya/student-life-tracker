export interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
}

export interface Book {
  id: string;
  title: string;
  author: string;
  progress: number;
  status: "reading" | "want-to-read" | "read" | "all-time-fav";
}

export interface VisionItem {
  id: string;
  title: string;
  category: string;
  timeline: "short-term" | "long-term";
}

export interface Income {
  id: string;
  source: string;
  amount: number;
  date: string;
  category: "gaji" | "freelance" | "investasi" | "lainnya";
}

export interface Expense {
  id: string;
  item: string;
  amount: number;
  date: string;
  category:
    | "makanan"
    | "transport"
    | "belanja"
    | "tagihan"
    | "hiburan"
    | "lainnya";
}

export interface WishItem {
  id: string;
  name: string;
  price: number;
  priority: "tinggi" | "sedang" | "rendah";
  targetDate?: string;
  saved: number;
}

// ===== ScheduleItem - PASTIKAN DIEXPORT =====
export interface ScheduleItem {
  id: string;
  title: string;
  type: "tuton" | "tugas1" | "tugas2" | "tugas3" | "uo";
  dueDate: string;
  description?: string;
}
export interface IPKRecord {
  id: string;
  semester: number;
  ipk: number;
  date: string;
  note?: string;
}
