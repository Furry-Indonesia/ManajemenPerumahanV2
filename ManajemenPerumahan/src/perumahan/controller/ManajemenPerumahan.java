package perumahan.controller;

import java.util.InputMismatchException;
import java.util.Scanner;
import perumahan.model.Properti;
import perumahan.model.Rumah;
import perumahan.model.Apartemen;
import perumahan.view.TampilanProperti;

public class ManajemenPerumahan {

    static Scanner input = new Scanner(System.in);

    public static void main(String[] args) {

        TampilanProperti view = new TampilanProperti();

        Properti[] propertiList = {
            new Rumah("R01", "Cluster Anggrek", 550000000, "Surabaya", "36", 72),
            new Rumah("R02", "Griya Melati Asri", 850000000, "Sidoarjo", "45", 90),
            new Rumah("R03", "Pesona Mawar", 450000000, "Gresik", "36", 60),
            new Rumah("R04", "Grand Kenanga", 1200000000, "Surabaya", "60", 120),
            new Rumah("R05", "Bumi Tulip Indah", 700000000, "Sidoarjo", "45", 84),
            new Apartemen("A01", "Puncak CBD", 350000000, "Surabaya", 15),
            new Apartemen("A02", "Bale Hinggil", 420000000, "Surabaya", 22),
            new Apartemen("A03", "Gunawangsa Merr", 300000000, "Surabaya", 10),
            new Apartemen("A04", "Pakuwon Indah", 950000000, "Surabaya", 35),
            new Apartemen("A05", "Taman Melati", 480000000, "Surabaya", 18)
        };

        int pilihan = -1;

        do {
            String garisMenu = "========================================================================================================================";
            String garisMenuTipis = "------------------------------------------------------------------------------------------------------------------------";

            System.out.println("\n" + garisMenu);
            System.out.println("                                               SISTEM MANAJEMEN PROPERTI");
            System.out.println(garisMenu);
            System.out.println(" Pembuat : Naila Nurul Faizah");
            System.out.println(" NIM     : 25051204343");
            System.out.println(garisMenu);
            System.out.println("                                                          MENU");
            System.out.println(garisMenuTipis);
            System.out.println(" 1. Tampilkan Semua Properti");
            System.out.println(" 2. Urutkan Harga Termurah");
            System.out.println(" 3. Urutkan Harga Termahal");
            System.out.println(" 4. Cari Properti");
            System.out.println(" 5. Beli Properti");
            System.out.println(" 0. Keluar");
            System.out.println(garisMenu);
            System.out.print(" Pilih menu : ");
            try {
                pilihan = input.nextInt();
                input.nextLine(); 
            } catch (InputMismatchException e) {
                System.out.println("\n[ERROR] Input harus berupa angka! Silakan coba lagi.\n");
                input.nextLine(); 
                continue;
            }

            switch(pilihan) {
                case 1:
                    view.tampilkanDaftar(propertiList);
                    break;
                case 2:
                    urutkanTermurah(propertiList);
                    view.tampilkanDaftar(propertiList);
                    break;
                case 3:
                    urutkanTermahal(propertiList);
                    view.tampilkanDaftar(propertiList);
                    break;
                case 4:
                    cariProperti(propertiList);
                    break;
                case 5:
                    beliProperti(propertiList);
                    break;
                case 0:
                    System.out.println("Terima kasih sudah mampir jangan lupa nilai 100nya.");
                    break;
                default:
                    System.out.println("Menu tidak tersedia.");
            }
        } while(pilihan != 0);
    }

    static void urutkanTermurah(Properti[] data){
        for(int i=0; i<data.length-1; i++){
            for(int j=0; j<data.length-i-1; j++){
                if(data[j].getHarga() > data[j+1].getHarga()){
                    Properti temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
        System.out.println("\n[BERHASIL] Data diurutkan dari harga termurah.");
    }

    static void urutkanTermahal(Properti[] data){
        for(int i=0; i<data.length-1; i++){
            for(int j=0; j<data.length-i-1; j++){
                if(data[j].getHarga() < data[j+1].getHarga()){
                    Properti temp = data[j];
                    data[j] = data[j+1];
                    data[j+1] = temp;
                }
            }
        }
        System.out.println("\n[BERHASIL] Data diurutkan dari harga termahal.");
    }

    static void cariProperti(Properti[] data){
        System.out.print("\nMasukkan nama properti : ");
        String nama = input.nextLine();
        boolean ditemukan = false;

        System.out.println("\n--- Hasil Pencarian ---");
        for(Properti p : data){
            if(p.getNama().toLowerCase().contains(nama.toLowerCase())){
                p.tampilkanInfo(); 
                ditemukan = true;
            }
        }

        if(!ditemukan){
            System.out.println("Properti tidak ditemukan.");
        }
        System.out.println();
    }

   static void beliProperti(Properti[] data){
        System.out.println("\n================================================ FORM PEMBELIAN PROPERTI ===============================================");
        
        System.out.print(String.format("%-35s : ", "Masukkan Nama Properti yang dibeli"));
        String namaProperti = input.nextLine();

        for(Properti p : data){
            if(p.getNama().equalsIgnoreCase(namaProperti)){
                
                if(p.isTerjual()){
                    System.out.println("\n[GAGAL] Maaf, properti ini sudah terjual kepada " + p.getNamaPembeli() + ".\n");
                } else {
                    System.out.println(String.format("%-35s : %s", "Harga Properti", p.formatRupiah(p.getHarga())));
                    System.out.println("------------------------------------------------------------------------------------------------------------------------");
                    
                    System.out.print(String.format("%-35s : ", "Masukkan Nama Pembeli"));
                    String namaPembeli = input.nextLine();
                    
                    System.out.print(String.format("%-35s : ", "Masukkan Alamat"));
                    String alamat = input.nextLine();
                    
                    System.out.print(String.format("%-35s : ", "Masukkan No HP"));
                    String noHp = input.nextLine();
                    
                    System.out.print(String.format("%-35s : ", "Masukkan Tanggal (DD/MM/YYYY)"));
                    String tanggal = input.nextLine();
                    
                    System.out.println("------------------------------------------------------------------------------------------------------------------------");
                    System.out.println("PILIH METODE PEMBAYARAN:");
                    System.out.println("1. Cash / Tunai");
                    System.out.println("2. Transfer Bank");
                    System.out.println("3. Kredit / Angsuran");
                    System.out.print(String.format("%-35s : ", "Masukkan Pilihan (1/2/3)"));
                    
                    String pilihanBayar = input.nextLine();
                    String metodeDipilih = "Cash"; 
                    
                    if (pilihanBayar.equals("2")) {
                        metodeDipilih = "Transfer Bank";
                        System.out.println("\n[INFO TRANSFER]");
                        System.out.println("Silakan transfer senilai " + p.formatRupiah(p.getHarga()) + " ke:");
                        System.out.println("- BCA     : 8734569012 a.n PT Perumahan Jaya");
                        System.out.println("- Mandiri : 1410098765 a.n PT Perumahan Jaya");
                        System.out.println("- BRI     : 0012345678 a.n PT Perumahan Jaya");
                        
                    } else if (pilihanBayar.equals("3")) {
                        double dp = p.getHarga() * 0.20; 
                        double sisaHutang = p.getHarga() - dp;
                        
                        System.out.println("\n[SIMULASI KREDIT]");
                        System.out.println(String.format("%-15s : %s", "DP (20%)", p.formatRupiah(dp)));
                        System.out.println(String.format("%-15s : %s", "Pokok Hutang", p.formatRupiah(sisaHutang)));
                        System.out.println(String.format("%-15s : %s / bulan", "Cicilan 12 Bln", p.formatRupiah(sisaHutang / 12)));
                        System.out.println(String.format("%-15s : %s / bulan", "Cicilan 24 Bln", p.formatRupiah(sisaHutang / 24)));
                        System.out.println(String.format("%-15s : %s / bulan", "Cicilan 36 Bln", p.formatRupiah(sisaHutang / 36)));
                        
                        System.out.println("------------------------------------------------------------------------------------------------------------------------");
                        
                        System.out.print(String.format("%-35s : ", "Masukkan pilihan angsuran (Bulan)"));
                        int bulan = 12; 
                        try {
                            bulan = Integer.parseInt(input.nextLine());
                        } catch (NumberFormatException e) {
                            System.out.println("[WARNING] Input tidak valid, otomatis diset ke 12 bulan.");
                        }
                        
                        double cicilanPilihan = sisaHutang / bulan;
                        System.out.println(String.format("%-35s : %s / bulan", "Tagihan Anda (" + bulan + " Bln)", p.formatRupiah(cicilanPilihan)));
                        
                        metodeDipilih = "Kredit (" + bulan + " Bulan)";
                        
                    } else {
                        System.out.println("\n[INFO CASH] Harap siapkan dana tunai senilai " + p.formatRupiah(p.getHarga()) + " saat penandatanganan akad.");
                    }
                    
                    System.out.println("------------------------------------------------------------------------------------------------------------------------");
                    System.out.print(String.format("%-35s : ", "Konfirmasi Pembelian (y/n)"));
                    String konfirmasi = input.nextLine();

                    if(konfirmasi.equalsIgnoreCase("y")) {
                        
                        p.setTerjual(true);
                        p.setNamaPembeli(namaPembeli);
                        p.setAlamatPembeli(alamat);
                        p.setNoHpPembeli(noHp);
                        p.setTanggalPembelian(tanggal);
                        p.setMetodePembayaran(metodeDipilih);

                        System.out.println("\n===================================================== DATA PEMBELIAN ===================================================");
                        System.out.println(String.format("%-17s : %s", "Nama Pembeli", p.getNamaPembeli()));
                        System.out.println(String.format("%-17s : %s", "Alamat", p.getAlamatPembeli()));
                        System.out.println(String.format("%-17s : %s", "No HP", p.getNoHpPembeli()));
                        System.out.println(String.format("%-17s : %s", "Tanggal", p.getTanggalPembelian()));
                        System.out.println(String.format("%-17s : %s", "Properti", p.getNama()));
                        System.out.println(String.format("%-17s : %s", "Harga", p.formatRupiah(p.getHarga())));
                        System.out.println(String.format("%-17s : %s", "Metode Bayar", p.getMetodePembayaran()));
                        System.out.println(String.format("%-17s : %s", "Status", "PEMBELIAN BERHASIL!"));
                        System.out.println("========================================================================================================================\n");
                    } else {
                        System.out.println("\n[INFO] Transaksi dibatalkan oleh pengguna.\n");
                    }
                }
                return; 
            }
        }
        System.out.println("\n[ERROR] Properti tidak ditemukan. Pastikan nama sesuai dengan daftar.\n");
    }
}