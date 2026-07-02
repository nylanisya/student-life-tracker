import { useState } from "react";
import { Income, Expense, WishItem } from "../types";

// Data contoh
const initialIncomes: Income[] = [
  {
    id: "1",
    source: "Gaji Bulanan",
    amount: 5000000,
    date: "2026-06-01",
    category: "gaji",
  },
  {
    id: "2",
    source: "Freelance Design",
    amount: 1500000,
    date: "2026-06-15",
    category: "freelance",
  },
];

const initialExpenses: Expense[] = [
  {
    id: "1",
    item: "Makan Siang",
    amount: 25000,
    date: "2026-06-30",
    category: "makanan",
  },
  {
    id: "2",
    item: "Transport Gojek",
    amount: 15000,
    date: "2026-06-29",
    category: "transport",
  },
  {
    id: "3",
    item: "Listrik",
    amount: 200000,
    date: "2026-06-28",
    category: "tagihan",
  },
];

const initialWishes: WishItem[] = [
  {
    id: "1",
    name: "Laptop Baru",
    price: 8000000,
    priority: "tinggi",
    targetDate: "2026-12-01",
    saved: 2000000,
  },
  {
    id: "2",
    name: "Headphone",
    price: 1200000,
    priority: "sedang",
    targetDate: "2026-08-01",
    saved: 500000,
  },
  {
    id: "3",
    name: "Buku Kuliah",
    price: 300000,
    priority: "rendah",
    saved: 100000,
  },
];

export function useFinance() {
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [wishes, setWishes] = useState<WishItem[]>(initialWishes);

  // Total pemasukan
  const totalIncome = incomes.reduce((sum, i) => sum + i.amount, 0);

  // Total pengeluaran
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  // Saldo
  const balance = totalIncome - totalExpense;

  // Tambah pemasukan
  const addIncome = (income: Omit<Income, "id">) => {
    const newIncome = { ...income, id: Date.now().toString() };
    setIncomes((prev) => [...prev, newIncome]);
  };

  // Tambah pengeluaran
  const addExpense = (expense: Omit<Expense, "id">) => {
    const newExpense = { ...expense, id: Date.now().toString() };
    setExpenses((prev) => [...prev, newExpense]);
  };

  // Tambah wishlist
  const addWish = (wish: Omit<WishItem, "id">) => {
    const newWish = { ...wish, id: Date.now().toString() };
    setWishes((prev) => [...prev, newWish]);
  };

  // Update tabungan wish
  const updateWishSaved = (id: string, amount: number) => {
    setWishes((prev) =>
      prev.map((wish) =>
        wish.id === id ? { ...wish, saved: wish.saved + amount } : wish
      )
    );
  };

  // Hapus wish
  const deleteWish = (id: string) => {
    setWishes((prev) => prev.filter((wish) => wish.id !== id));
  };

  // Hapus expense
  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((e) => e.id !== id));
  };

  return {
    incomes,
    expenses,
    wishes,
    totalIncome,
    totalExpense,
    balance,
    addIncome,
    addExpense,
    addWish,
    updateWishSaved,
    deleteWish,
    deleteExpense,
  };
}
