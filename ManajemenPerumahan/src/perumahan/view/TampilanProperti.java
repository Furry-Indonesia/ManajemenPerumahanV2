package perumahan.view;
import perumahan.model.Properti;

public class TampilanProperti {

    public void tampilkanDaftar(Properti[] data){

        String garisTebal = "========================================================================================================================";
        String garisTipis = "------------------------------------------------------------------------------------------------------------------------";

        System.out.println("\n" + garisTebal);
        System.out.println("                                                DAFTAR PROPERTI");
        System.out.println(garisTebal);
        
        System.out.printf("%-5s | %-10s | %-20s | %-10s | %-10s | %-16s | %-10s | %-15s\n",
                "ID", "Kategori", "Nama", "Detail", "Ukuran", "Harga", "Status", "Pembeli");
        System.out.println(garisTipis);

        for(Properti p : data){
            p.tampilkanInfo(); 
        }

        System.out.println(garisTebal + "\n");
    }
}