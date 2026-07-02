import React, { useState } from "react";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { useFinance } from "../hooks/useFinance";

const Finance: React.FC = () => {
  const {
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
  } = useFinance();

  const [showIncomeForm, setShowIncomeForm] = useState(false);
  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [showWishForm, setShowWishForm] = useState(false);

  const [incomeForm, setIncomeForm] = useState({
    source: "",
    amount: "",
    category: "gaji",
  });
  const [expenseForm, setExpenseForm] = useState({
    item: "",
    amount: "",
    category: "makanan",
  });
  const [wishForm, setWishForm] = useState({
    name: "",
    price: "",
    priority: "sedang",
    targetDate: "",
  });

  const handleAddIncome = (e: React.FormEvent) => {
    e.preventDefault();
    if (!incomeForm.source || !incomeForm.amount) return;
    addIncome({
      source: incomeForm.source,
      amount: parseInt(incomeForm.amount),
      date: new Date().toISOString().split("T")[0],
      category: incomeForm.category as any,
    });
    setIncomeForm({ source: "", amount: "", category: "gaji" });
    setShowIncomeForm(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.item || !expenseForm.amount) return;
    addExpense({
      item: expenseForm.item,
      amount: parseInt(expenseForm.amount),
      date: new Date().toISOString().split("T")[0],
      category: expenseForm.category as any,
    });
    setExpenseForm({ item: "", amount: "", category: "makanan" });
    setShowExpenseForm(false);
  };

  const handleAddWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishForm.name || !wishForm.price) return;
    addWish({
      name: wishForm.name,
      price: parseInt(wishForm.price),
      priority: wishForm.priority as any,
      targetDate: wishForm.targetDate || undefined,
      saved: 0,
    });
    setWishForm({ name: "", price: "", priority: "sedang", targetDate: "" });
    setShowWishForm(false);
  };

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "tinggi":
        return "text-red-500 bg-red-50";
      case "sedang":
        return "text-yellow-500 bg-yellow-50";
      case "rendah":
        return "text-green-500 bg-green-50";
      default:
        return "text-gray-500 bg-gray-50";
    }
  };

  const categoryColors: Record<string, string> = {
    gaji: "bg-green-100 text-green-700",
    freelance: "bg-blue-100 text-blue-700",
    investasi: "bg-purple-100 text-purple-700",
    lainnya: "bg-gray-100 text-gray-700",
    makanan: "bg-orange-100 text-orange-700",
    transport: "bg-cyan-100 text-cyan-700",
    belanja: "bg-pink-100 text-pink-700",
    tagihan: "bg-red-100 text-red-700",
    hiburan: "bg-indigo-100 text-indigo-700",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Wallet size={20} className="text-pink-500" />
          Keuangan
        </h2>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
              <TrendingUp size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Pemasukan</p>
              <p className="text-lg font-bold text-green-600">
                {formatRupiah(totalIncome)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
              <TrendingDown size={20} className="text-red-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Total Pengeluaran</p>
              <p className="text-lg font-bold text-red-500">
                {formatRupiah(totalExpense)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl ${
                balance >= 0 ? "bg-blue-50" : "bg-red-50"
              } flex items-center justify-center`}
            >
              <Wallet
                size={20}
                className={balance >= 0 ? "text-blue-500" : "text-red-500"}
              />
            </div>
            <div>
              <p className="text-xs text-gray-400">Saldo</p>
              <p
                className={`text-lg font-bold ${
                  balance >= 0 ? "text-blue-600" : "text-red-600"
                }`}
              >
                {formatRupiah(balance)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pemasukan & Pengeluaran + Wishlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Kolom Kiri: Pemasukan & Pengeluaran */}
        <div className="flex flex-col gap-4">
          {/* Pemasukan */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm flex-1 flex flex-col max-h-[220px]">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingUp size={16} className="text-green-500" />
                Pemasukan
              </h3>
              <button
                onClick={() => setShowIncomeForm(!showIncomeForm)}
                className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
              >
                <Plus size={14} />
                Tambah
              </button>
            </div>

            {showIncomeForm && (
              <form
                onSubmit={handleAddIncome}
                className="mb-3 p-3 bg-pink-50 rounded-xl space-y-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Sumber"
                  value={incomeForm.source}
                  onChange={(e) =>
                    setIncomeForm({ ...incomeForm, source: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Jumlah"
                    value={incomeForm.amount}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, amount: e.target.value })
                    }
                    className="flex-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <select
                    value={incomeForm.category}
                    onChange={(e) =>
                      setIncomeForm({ ...incomeForm, category: e.target.value })
                    }
                    className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="gaji">Gaji</option>
                    <option value="freelance">Freelance</option>
                    <option value="investasi">Investasi</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowIncomeForm(false)}
                    className="px-4 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
              {incomes.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">
                  Belum ada pemasukan
                </p>
              ) : (
                incomes.map((income) => (
                  <div
                    key={income.id}
                    className="flex items-center justify-between p-2 bg-green-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {income.source}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          categoryColors[income.category]
                        }`}
                      >
                        {income.category}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-green-600">
                      +{formatRupiah(income.amount)}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Pengeluaran */}
          <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm flex-1 flex flex-col max-h-[220px]">
            <div className="flex items-center justify-between mb-3 shrink-0">
              <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <TrendingDown size={16} className="text-red-500" />
                Pengeluaran
              </h3>
              <button
                onClick={() => setShowExpenseForm(!showExpenseForm)}
                className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
              >
                <Plus size={14} />
                Tambah
              </button>
            </div>

            {showExpenseForm && (
              <form
                onSubmit={handleAddExpense}
                className="mb-3 p-3 bg-pink-50 rounded-xl space-y-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Nama Item"
                  value={expenseForm.item}
                  onChange={(e) =>
                    setExpenseForm({ ...expenseForm, item: e.target.value })
                  }
                  className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Jumlah"
                    value={expenseForm.amount}
                    onChange={(e) =>
                      setExpenseForm({ ...expenseForm, amount: e.target.value })
                    }
                    className="flex-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  />
                  <select
                    value={expenseForm.category}
                    onChange={(e) =>
                      setExpenseForm({
                        ...expenseForm,
                        category: e.target.value,
                      })
                    }
                    className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                  >
                    <option value="makanan">Makanan</option>
                    <option value="transport">Transport</option>
                    <option value="belanja">Belanja</option>
                    <option value="tagihan">Tagihan</option>
                    <option value="hiburan">Hiburan</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition"
                  >
                    Simpan
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowExpenseForm(false)}
                    className="px-4 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            )}

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 min-h-0">
              {expenses.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-2">
                  Belum ada pengeluaran
                </p>
              ) : (
                expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-2 bg-red-50 rounded-xl"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {expense.item}
                      </p>
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          categoryColors[expense.category]
                        }`}
                      >
                        {expense.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-red-500">
                        -{formatRupiah(expense.amount)}
                      </span>
                      <button
                        onClick={() => deleteExpense(expense.id)}
                        className="text-gray-400 hover:text-red-500 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ===== KOLOM KANAN: TARGET BELANJA (FIX) ===== */}
        <div className="bg-white rounded-2xl p-5 border border-pink-100 shadow-sm flex flex-col max-h-[460px]">
          <div className="flex items-center justify-between mb-3 shrink-0">
            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
              <ShoppingBag size={16} className="text-pink-500" />
              Target Belanja
            </h3>
            <button
              onClick={() => setShowWishForm(!showWishForm)}
              className="text-xs text-pink-500 hover:text-pink-600 font-medium flex items-center gap-1"
            >
              <Plus size={14} />
              Tambah
            </button>
          </div>

          {showWishForm && (
            <form
              onSubmit={handleAddWish}
              className="mb-3 p-3 bg-pink-50 rounded-xl space-y-2 shrink-0"
            >
              <input
                type="text"
                placeholder="Nama Barang"
                value={wishForm.name}
                onChange={(e) =>
                  setWishForm({ ...wishForm, name: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Harga"
                  value={wishForm.price}
                  onChange={(e) =>
                    setWishForm({ ...wishForm, price: e.target.value })
                  }
                  className="flex-1 px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
                <select
                  value={wishForm.priority}
                  onChange={(e) =>
                    setWishForm({ ...wishForm, priority: e.target.value })
                  }
                  className="px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                >
                  <option value="tinggi">Tinggi</option>
                  <option value="sedang">Sedang</option>
                  <option value="rendah">Rendah</option>
                </select>
              </div>
              <input
                type="date"
                placeholder="Target"
                value={wishForm.targetDate}
                onChange={(e) =>
                  setWishForm({ ...wishForm, targetDate: e.target.value })
                }
                className="w-full px-3 py-1.5 text-sm border border-pink-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:opacity-90 transition"
                >
                  Simpan
                </button>
                <button
                  type="button"
                  onClick={() => setShowWishForm(false)}
                  className="px-4 py-1.5 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition"
                >
                  Batal
                </button>
              </div>
            </form>
          )}

          {/* LIST WISHLIST - SCROLL */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-0">
            {wishes.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-8">
                Belum ada target belanja
              </p>
            ) : (
              wishes.map((wish) => {
                const progress = Math.min((wish.saved / wish.price) * 100, 100);
                const isComplete = progress >= 100;
                return (
                  <div
                    key={wish.id}
                    className="p-2.5 border border-pink-100 rounded-xl"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full ${getPriorityColor(
                              wish.priority
                            )}`}
                          >
                            {wish.priority}
                          </span>
                          <span className="text-sm font-medium text-gray-800 truncate">
                            {wish.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 flex-wrap">
                          <span>Target: {formatRupiah(wish.price)}</span>
                          <span>|</span>
                          <span>Tabungan: {formatRupiah(wish.saved)}</span>
                          {wish.targetDate && (
                            <>
                              <span>|</span>
                              <span className="text-[10px]">
                                {new Date(wish.targetDate).toLocaleDateString(
                                  "id-ID"
                                )}
                              </span>
                            </>
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-pink-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all ${
                                isComplete
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r from-pink-400 to-pink-500"
                              }`}
                              style={{ width: `${Math.min(progress, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-pink-500 shrink-0">
                            {Math.round(progress)}%
                          </span>
                        </div>
                        {isComplete && (
                          <p className="text-[10px] text-green-500 font-medium mt-0.5">
                            Target tercapai!
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          onClick={() => {
                            const amount = prompt(
                              "Tambahkan tabungan (Rp):",
                              "100000"
                            );
                            if (amount) {
                              updateWishSaved(wish.id, parseInt(amount));
                            }
                          }}
                          className="text-[10px] text-pink-500 hover:text-pink-600 bg-pink-50 px-2 py-1 rounded-lg"
                        >
                          +Tabung
                        </button>
                        <button
                          onClick={() => deleteWish(wish.id)}
                          className="text-gray-400 hover:text-red-500 transition"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Finance;
