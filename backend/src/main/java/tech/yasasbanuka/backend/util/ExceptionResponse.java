package tech.yasasbanuka.backend.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Timestamp;

@AllArgsConstructor
@NoArgsConstructor
@Data @Builder
public class ExceptionResponse {
    private int statusCode;
    private String exception;
    private String message;
    private String timeStamp;
}
