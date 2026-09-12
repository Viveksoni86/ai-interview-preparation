package com.vivek.ai.resume.util;

import java.io.IOException;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.web.multipart.MultipartFile;


public class PdfUtil {
	
	public static String extractText(MultipartFile file) throws IOException {
		
		PDDocument document = Loader.loadPDF(file.getBytes());
		
		PDFTextStripper stripper = new PDFTextStripper();
		
		String text = stripper.getText(document);
		
		document.close();
		
	return text ;
		
		
	}

}
