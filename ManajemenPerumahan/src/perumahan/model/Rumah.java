package perumahan.model;

public class Rumah extends Properti {

    private String tipe;
    private int luas;

    public Rumah(String id, String nama, double harga, String lokasi, String tipe, int luas) {
        super(id, nama, harga, lokasi);
        this.tipe = tipe;
        this.luas = luas;
    }

    @Override
    public void tampilkanInfo() {
        String status = isTerjual() ? "TERJUAL" : "TERSEDIA";
        String strDetail = String.format("Tipe %s", tipe);
        String strUkuran = String.format("%d m2", luas);
        
        System.out.printf("%-5s | %-10s | %-20s | %-10s | %-10s | %-16s | %-10s | %-15s\n",
                getId(), "Rumah", getNama(), strDetail, strUkuran, formatRupiah(getHarga()), status, getNamaPembeli());
    }
}