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
    harga?: number;
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
    tanggal?: Date;
    jumlah?: number;
    harga?: number;
    total?: number;
    produk: PRODUK;
}
export interface ORDER {
    id?: number;
    mitraid?: string;
    tanggal?: Date;
    nama_pembeli?: string;
    total?: number;
    user_input?: string;
    user_execute?: string;
    status?: number;
    tanggal_selesai?: string;
    transaksi: TRANSAKSI[]
}