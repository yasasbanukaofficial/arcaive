package tech.yasasbanuka.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionCreateRequestDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionResponseDTO;
import tech.yasasbanuka.backend.dto.subscription.SubscriptionUpdateRequestDTO;
import tech.yasasbanuka.backend.service.SubscriptionService;
import tech.yasasbanuka.backend.util.APIResponse;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/subscriptions")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequiredArgsConstructor
public class SubscriptionController {
    private final SubscriptionService subscriptionService;

    @GetMapping
    public ResponseEntity<APIResponse<List<SubscriptionResponseDTO>>> getAllSubscriptions() {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched all subscriptions successfully", subscriptionService.getAllSubscriptions()), HttpStatus.OK);
    }

    @GetMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> getSubscription(@PathVariable UUID subscriptionId) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Fetched subscription successfully", subscriptionService.getSubscription(subscriptionId)), HttpStatus.OK);
    }

    @PutMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> updateSubscription(@PathVariable UUID subscriptionId, @RequestBody @Valid SubscriptionUpdateRequestDTO dto) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription updated successfully", subscriptionService.updateSubscription(subscriptionId, dto)), HttpStatus.OK);
    }

    @DeleteMapping("/{subscriptionId}")
    public ResponseEntity<APIResponse<Boolean>> deleteSubscription(@PathVariable UUID subscriptionId) {
        subscriptionService.deleteSubscription(subscriptionId);
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.OK.value(), "Subscription deleted successfully", null), HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<APIResponse<SubscriptionResponseDTO>> createSubscription(@RequestBody @Valid SubscriptionCreateRequestDTO dto) {
        return new ResponseEntity<>(new APIResponse<>(true, HttpStatus.CREATED.value(), "Subscription created successfully", subscriptionService.createSubscription(dto)), HttpStatus.CREATED);
    }
}
