package tech.yasasbanuka.backend.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Component
public class PDFTextExtract {
    public String extract(MultipartFile file) {
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            return pdfTextStripper.getText(doc);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}
