package tech.yasasbanuka.backend.exception;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import tech.yasasbanuka.backend.util.ExceptionResponse;

import java.time.Instant;

@RestControllerAdvice
@Slf4j
public class GlobalException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleValidation(MethodArgumentNotValidException ex) {
        log.warn("Validation error: {}", ex.getMessage());
        String fieldMessage = ex.getBindingResult().getFieldErrors().stream()
                .findFirst()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .orElse("One or more fields are invalid. Please check your input.");
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .exception(ex.getClass().getSimpleName())
                .message(fieldMessage)
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleHttpMessageNotReadable(HttpMessageNotReadableException ex) {
        log.warn("HTTP Message not readable: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .exception(ex.getClass().getSimpleName())
                .message("The request body is missing or contains invalid JSON. Please check your input and try again.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(BadCredentialsException.class)
    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    public ExceptionResponse handleBadCredentials(BadCredentialsException ex) {
        log.warn("Bad credentials: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.UNAUTHORIZED.value())
                .exception(ex.getClass().getSimpleName())
                .message("Incorrect password. Please try again.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(AccessDeniedException.class)
    @ResponseStatus(HttpStatus.FORBIDDEN)
    public ExceptionResponse handleAccessDenied(AccessDeniedException ex) {
        log.warn("Access denied: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.FORBIDDEN.value())
                .exception(ex.getClass().getSimpleName())
                .message("You don't have permission to perform this action.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(EmailNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponse handleEmailNotFound(EmailNotFoundException ex) {
        log.warn("Email not found: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .exception(ex.getClass().getSimpleName())
                .message("No account found with this email address.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponse handleResourceNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }


    @ExceptionHandler(UsernameNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ExceptionResponse handleUsernameNotFound(UsernameNotFoundException ex) {
        log.warn("Username not found: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .exception(ex.getClass().getSimpleName())
                .message("No account found with this email address.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(AlreadyExistsException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ExceptionResponse handleAlreadyExists(AlreadyExistsException ex) {
        log.warn("Resource already exists: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(IllegalArgumentException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleIllegalArgument(IllegalArgumentException ex) {
        log.warn("Illegal argument: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.BAD_REQUEST.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    @ResponseStatus(HttpStatus.CONFLICT)
    public ExceptionResponse handleDataIntegrity(DataIntegrityViolationException ex) {
        log.error("Data integrity violation: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.CONFLICT.value())
                .exception(ex.getClass().getSimpleName())
                .message("This action conflicts with existing data. Please verify your input and try again.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(NullPointerException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleNullPointer(NullPointerException ex) {
        log.error("Null pointer exception: ", ex);
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(java.lang.reflect.UndeclaredThrowableException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleUndeclared(java.lang.reflect.UndeclaredThrowableException ex) {
        Throwable cause = ex.getUndeclaredThrowable();
        Throwable realCause = cause != null ? cause : ex;
        log.error("Undeclared throwable exception: ", realCause);
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(realCause.getClass().getSimpleName())
                .message(realCause.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleGeneric(Exception ex) {
        log.error("Unhandled exception: ", ex);
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(JsonProcessingException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleJsonProcessing(JsonProcessingException ex) {
        log.error("JSON processing error: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message("Failed to process data. Please try again.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(JsonMappingException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleJsonMapping(JsonMappingException ex) {
        log.error("JSON mapping error: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message("Failed to map response data. Please try again.")
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(QuotaExceededException.class)
    @ResponseStatus(HttpStatus.TOO_MANY_REQUESTS)
    public ExceptionResponse handleQuotaExceeded(QuotaExceededException ex) {
        log.warn("Quota exceeded: {}", ex.getMessage());
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.TOO_MANY_REQUESTS.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }


}
