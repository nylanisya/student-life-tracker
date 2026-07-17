const API_URL = "https://naylanisya.rf.gd/api.php";

export interface IpkData {
  id: number;
  semester: number;
  ipk: number;
  created_at: string;
}

export const ipkApi = {
  // GET semua IPK
  getAll: async (): Promise<IpkData[]> => {
    const res = await fetch(`${API_URL}?table=ipk_history`);
    if (!res.ok) throw new Error("Gagal fetch IPK");
    return res.json();
  },

  // GET IPK terbaru (diambil dari semua data, disortir di frontend)
  getLatest: async (): Promise<IpkData | null> => {
    const res = await fetch(`${API_URL}?table=ipk_history`);
    if (!res.ok) throw new Error("Gagal fetch IPK terbaru");
    const data: IpkData[] = await res.json();
    if (data.length === 0) return null;
    // urutkan berdasarkan created_at terbaru
    return data.reduce((latest, curr) =>
      new Date(curr.created_at) > new Date(latest.created_at) ? curr : latest
    );
  },

  // POST tambah IPK
  create: async (data: { semester: number; ipk: number }): Promise<IpkData> => {
    const res = await fetch(`${API_URL}?table=ipk_history`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal tambah IPK");
    return res.json();
  },

  // PUT update IPK
  update: async (
    id: number,
    data: { semester: number; ipk: number }
  ): Promise<void> => {
    const res = await fetch(`${API_URL}?table=ipk_history&id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal update IPK");
  },

  // DELETE IPK
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}?table=ipk_history&id=${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal hapus IPK");
  },
};
