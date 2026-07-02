const API_URL = "http://localhost:5000/api";

export interface IpkData {
  id: number;
  semester: number;
  ipk: number;
  created_at: string;
}

export const ipkApi = {
  // GET semua IPK
  getAll: async (): Promise<IpkData[]> => {
    const res = await fetch(`${API_URL}/ipk`);
    if (!res.ok) throw new Error("Gagal fetch IPK");
    return res.json();
  },

  // GET IPK terbaru
  getLatest: async (): Promise<IpkData | null> => {
    const res = await fetch(`${API_URL}/ipk/latest`);
    if (!res.ok) throw new Error("Gagal fetch IPK terbaru");
    return res.json();
  },

  // POST tambah IPK
  create: async (data: { semester: number; ipk: number }): Promise<IpkData> => {
    const res = await fetch(`${API_URL}/ipk`, {
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
    const res = await fetch(`${API_URL}/ipk/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Gagal update IPK");
  },

  // DELETE IPK
  delete: async (id: number): Promise<void> => {
    const res = await fetch(`${API_URL}/ipk/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Gagal hapus IPK");
  },
};
