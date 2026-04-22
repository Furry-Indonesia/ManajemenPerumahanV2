package perumahan.model;

public class Rumah extends Properti {
    private String tipe;
    private int luasTanah;

    public Rumah(String kode, String nama, double harga, String lokasi, String tipe, int luasTanah) {
        super(kode, nama, harga, lokasi);
        this.tipe = tipe;
        this.luasTanah = luasTanah;
    }

    @Override
    public void tampilkanInfo() {
        System.out.println(kode + " | Rumah | " + nama + " | " + tipe + " | " + luasTanah + "m2 | " + formatRupiah(harga));
    }
}