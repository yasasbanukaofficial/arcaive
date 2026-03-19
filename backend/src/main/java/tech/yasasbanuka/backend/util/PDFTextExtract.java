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
@Slf4j
public class PDFTextExtract {
    public String extract(MultipartFile file) {
        log.info("Extracting text from PDF: {}", file.getOriginalFilename());
        try (PDDocument doc = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper pdfTextStripper = new PDFTextStripper();
            String text = pdfTextStripper.getText(doc);
            log.info("Successfully extracted {} characters from PDF: {}", text.length(), file.getOriginalFilename());
            return text;
        } catch (IOException e) {
            log.error("Failed to extract text from PDF: {}", e.getMessage());
            throw new RuntimeException(e);
        }
    }
}
