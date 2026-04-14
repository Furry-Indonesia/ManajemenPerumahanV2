package perumahan.controller;

import perumahan.model.*;
import perumahan.view.TampilanProperti;

public class ManajemenPerumahan {

    public static void main(String[] args) {

        Properti[] data = {
    new Rumah("R01", "Rumah A", 150000000, "Surabaya", "36", 72),
    new Rumah("R02", "Rumah B", 200000000, "Sidoarjo", "45", 90),
    new Apartemen("A01", "Apt C", 300000000, "Surabaya", 5),
    new Apartemen("A02", "Apt D", 500000000, "Surabaya", 10),
    new Rumah("R03", "Rumah E", 400000000, "Gresik", "60", 120)
};

        new TampilanProperti(data).setVisible(true);
    }
}