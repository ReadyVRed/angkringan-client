export interface MITRA {
    mitraid?: string;
    nama?: string;
    status?: boolean;
    alamat?: string;
}
export interface USER {
    userid?: string;
    nama?: string;
    mitraid?: string;
    password?: string;
    status?: boolean;
    level?: number;
}
export interface PRODUK {
    id?: number;
    mitraid?: string;
    nama?: string;
    stock?: number;
    harga_dasar?: number;
    harga_jual?: number;
    kategori?: string;
    nama_struk?: string;
    last_update?: Date;
    status?: boolean;
    user_update?: string;
}
export interface TRANSAKSI {
    id?: number;
    order_id?: number;
    produkid?: number;
    tanggal?: string;
    jam?: string;
    stock_sebelum?: number;
    jumlah?: number;
    harga_dasar?: number;
    harga_jual?: number;
    total?: number;
    produk?: PRODUK;
}
export interface ORDER {
    id?: number;
    mitraid?: string;
    mitra?: MITRA;
    tanggal?: string;
    jam?: string;
    nama_pembeli?: string;
    bayar?: number;
    kembalian?: number;
    total?: number;
    user_input?: string;
    user_execute?: string;
    status?: number;
    tanggal_selesai?: string;
    jam_selesai?: string;
    transaksi?: TRANSAKSI[]
}
export interface ORDER_PRODUK {
    Produk: PRODUK;
    stock: number;
    jumlah: number;
    total: number;
}
export interface LAPORAN_PERTANGGAL {
    tanggal?: string;
    jumlah?: number;
    total?: number;
    pendapatan?: number;
}
export interface LAPORAN_PERPRODUK {
    produk?: PRODUK;
    jumlah?: number;
    total?: number;
    pendapatan?: number;
}