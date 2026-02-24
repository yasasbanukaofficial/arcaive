package tech.yasasbanuka.backend.util;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class APIResponse<T> {
    private boolean success;
    private int statusCode;
    private String message;
    private T data;
}
