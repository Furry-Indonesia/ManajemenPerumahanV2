package perumahan;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ManajemenPerumahanApplication {
    public static void main(String[] args) {
        SpringApplication.run(ManajemenPerumahanApplication.class, args);
        System.out.println("=============================================");
        System.out.println("Backend siap! Buka: http://localhost:8080/");
        System.out.println("=============================================");
    }
}