package tech.yasasbanuka.backend.exception;

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
public class GlobalException {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ExceptionResponse handleValidation(MethodArgumentNotValidException ex) {
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
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ExceptionResponse handleGeneric(Exception ex) {
        return ExceptionResponse.builder()
                .statusCode(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .exception(ex.getClass().getSimpleName())
                .message(ex.getMessage())
                .timeStamp(Instant.now().toString())
                .build();
    }
}
