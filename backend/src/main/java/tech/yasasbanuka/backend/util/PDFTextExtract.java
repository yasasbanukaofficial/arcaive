package tech.yasasbanuka.backend.util;

import lombok.extern.slf4j.Slf4j;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.AutoDetectParser;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.tags.form.InputTag;

import java.io.IOException;
import java.io.InputStream;

@Component
@Slf4j
public class PDFTextExtract {
    public String extract(MultipartFile file) {
        log.info("Extracting text from PDF: {}", file.getOriginalFilename());
        AutoDetectParser parser = new AutoDetectParser();
        BodyContentHandler handler = new BodyContentHandler(-1);
        Metadata metadata = new Metadata();
        ParseContext parseContext = new ParseContext();
        try (InputStream stream = file.getInputStream()){
            parser.parse(stream, handler, metadata, parseContext);
            return handler.toString();
        } catch (Exception e) {
            log.error("Failed to extract text from {}: {}", file.getOriginalFilename(), e.getMessage());
            throw new RuntimeException("Could not process the uploaded file.");
        }
    }
}
