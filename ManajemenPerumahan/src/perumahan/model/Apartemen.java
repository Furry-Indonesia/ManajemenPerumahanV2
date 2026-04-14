package perumahan.model;

public class Apartemen extends Properti {

    private int lantai;

    public Apartemen(String id, String nama, double harga, String lokasi, int lantai) {
        super(id, nama, harga, lokasi);
        this.lantai = lantai;
    }

    @Override
    public void tampilkanInfo() {
        String status = isTerjual() ? "TERJUAL" : "TERSEDIA";
        String strDetail = "-";
        String strUkuran = String.format("Lt. %d", lantai);
        
        System.out.printf("%-5s | %-10s | %-20s | %-10s | %-10s | %-16s | %-10s | %-15s\n",
                getId(), "Apartemen", getNama(), strDetail, strUkuran, formatRupiah(getHarga()), status, getNamaPembeli());
    }
}