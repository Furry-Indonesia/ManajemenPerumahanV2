package perumahan.view;

import java.awt.*;
import java.util.ArrayList;
import javax.swing.*;
import javax.swing.table.DefaultTableModel;
import perumahan.model.*;

public class TampilanProperti extends JFrame {

    private JTable tabel;
    private DefaultTableModel model;
    private ArrayList<Properti> data;

    public TampilanProperti(Properti[] dataArray) {

        // ===== STYLE MODERN =====
        try {
            UIManager.setLookAndFeel("javax.swing.plaf.nimbus.NimbusLookAndFeel");
        } catch (Exception e) {}

        data = new ArrayList<>();
        for (Properti p : dataArray) data.add(p);

        setTitle("Manajemen Properti Modern");
        setSize(1000, 500);
        setLocationRelativeTo(null);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        // ===== TABLE =====
        String[] kolom = {"Kode", "Nama", "Harga", "Lokasi", "Status", "Pembeli"};
        model = new DefaultTableModel(kolom, 0);
        tabel = new JTable(model);

        tabel.setRowHeight(25);
        tabel.setFont(new Font("Segoe UI", Font.PLAIN, 14));

        JScrollPane scroll = new JScrollPane(tabel);

        // ===== BUTTON STYLE =====
        JButton tambah = createButton("Tambah");
        JButton edit = createButton("Edit");
        JButton hapus = createButton("Hapus");
        JButton cari = createButton("Cari");
        JButton asc = createButton("Termurah");
        JButton desc = createButton("Termahal");
        JButton beli = createButton("Beli");

        JPanel panel = new JPanel();
        panel.setBackground(Color.WHITE);
        panel.add(tambah);
        panel.add(edit);
        panel.add(hapus);
        panel.add(cari);
        panel.add(asc);
        panel.add(desc);
        panel.add(beli);