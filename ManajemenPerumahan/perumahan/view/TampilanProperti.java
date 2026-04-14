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

        add(scroll, BorderLayout.CENTER);
        add(panel, BorderLayout.SOUTH);

        tampilkanData();

        // ===== ACTION =====
        tambah.addActionListener(e -> tambahData());
        edit.addActionListener(e -> editData());
        hapus.addActionListener(e -> hapusData());
        cari.addActionListener(e -> cariData());
        beli.addActionListener(e -> beliProperti());

        asc.addActionListener(e -> {
            data.sort((a, b) -> Double.compare(a.getHarga(), b.getHarga()));
            tampilkanData();
        });

        desc.addActionListener(e -> {
            data.sort((a, b) -> Double.compare(b.getHarga(), a.getHarga()));
            tampilkanData();
        });
    }

    // ===== BUTTON CUSTOM =====
    private JButton createButton(String text) {
        JButton btn = new JButton(text);
        btn.setFocusPainted(false);
        btn.setBackground(new Color(52, 152, 219)); // biru modern
        btn.setForeground(Color.WHITE);
        btn.setFont(new Font("Segoe UI", Font.BOLD, 13));
        btn.setPreferredSize(new Dimension(120, 35));
        return btn;
    }

    private void tampilkanData() {
        model.setRowCount(0);
        for (Properti p : data) {
            model.addRow(new Object[]{
                p.getKode(),
                p.getNama(),
                p.getHargaFormat(),
                p.getLokasi(),
                p.isTerjual() ? "Terjual" : "Tersedia",
                p.getNamaPembeli()
            });
        }
    }

    // ===== CRUD =====

    private void tambahData() {
        JTextField kode = new JTextField();
        JTextField nama = new JTextField();
        JTextField harga = new JTextField();
        JTextField lokasi = new JTextField();

        Object[] form = {
            "Kode:", kode,
            "Nama:", nama,
            "Harga:", harga,
            "Lokasi:", lokasi
        };

        int result = JOptionPane.showConfirmDialog(this, form, "Tambah Data", JOptionPane.OK_CANCEL_OPTION);

        if (result == JOptionPane.OK_OPTION) {
            data.add(new Properti(
                kode.getText(),
                nama.getText(),
                Double.parseDouble(harga.getText()),
                lokasi.getText()
            ));
            tampilkanData();
        }
    }

    private void editData() {
        int row = tabel.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Pilih data dulu!");
            return;
        }

        Properti p = data.get(row);

        JTextField nama = new JTextField(p.getNama());
        JTextField harga = new JTextField(String.valueOf(p.getHarga()));
        JTextField lokasi = new JTextField(p.getLokasi());

        Object[] form = {
            "Nama:", nama,
            "Harga:", harga,
            "Lokasi:", lokasi
        };

        int result = JOptionPane.showConfirmDialog(this, form, "Edit Data", JOptionPane.OK_CANCEL_OPTION);

        if (result == JOptionPane.OK_OPTION) {
            data.set(row, new Properti(
                p.getKode(),
                nama.getText(),
                Double.parseDouble(harga.getText()),
                lokasi.getText()
            ));
            tampilkanData();
        }
    }

    private void hapusData() {
        int row = tabel.getSelectedRow();
        if (row == -1) {
            JOptionPane.showMessageDialog(this, "Pilih data dulu!");
            return;
        }

        data.remove(row);
        tampilkanData();
    }

    private void cariData() {
        String keyword = JOptionPane.showInputDialog("Cari nama:");

        model.setRowCount(0);
        for (Properti p : data) {
            if (p.getNama().toLowerCase().contains(keyword.toLowerCase())) {
                model.addRow(new Object[]{
                    p.getKode(),
                    p.getNama(),
                    p.getHargaFormat(),
                    p.getLokasi(),
                    p.isTerjual() ? "Terjual" : "Tersedia",
                    p.getNamaPembeli()
                });
            }
        }
    }
    private void beliProperti() {
    int row = tabel.getSelectedRow();

    if (row == -1) {
        JOptionPane.showMessageDialog(this, "Pilih properti dulu!");
        return;
    }

    Properti p = data.get(row);

    if (p.isTerjual()) {
        JOptionPane.showMessageDialog(this, "Properti sudah terjual!");
        return;
    }

    JTextField nama = new JTextField();
    JTextField alamat = new JTextField();
    JTextField noHp = new JTextField();
    JTextField tanggal = new JTextField();

    String[] metode = {"Cash", "Transfer", "Kredit"};
    JComboBox<String> metodeBox = new JComboBox<>(metode);

    Object[] form = {
        "Nama Pembeli:", nama,
        "Alamat:", alamat,
        "No HP:", noHp,
        "Tanggal:", tanggal,
        "Metode:", metodeBox
    };

    int result = JOptionPane.showConfirmDialog(this, form, "Pembelian", JOptionPane.OK_CANCEL_OPTION);

    if (result == JOptionPane.OK_OPTION) {
        p.setTerjual(true);
        p.setNamaPembeli(nama.getText());
        p.setAlamatPembeli(alamat.getText());
        p.setNoHpPembeli(noHp.getText());
        p.setTanggalPembelian(tanggal.getText());
        p.setMetodePembayaran(metodeBox.getSelectedItem().toString());

