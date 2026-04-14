package perumahan.model;

public class Apartemen extends Properti {
    private int lantai;

    public Apartemen(String kode, String nama, double harga, String lokasi, int lantai) {
        super(kode, nama, harga, lokasi);
        this.lantai = lantai;
    }

    @Override
    public void tampilkanInfo() {
        System.out.println(kode + " | Apartemen | " + nama + " | Lt " + lantai + " | " + formatRupiah(harga));
    }
}