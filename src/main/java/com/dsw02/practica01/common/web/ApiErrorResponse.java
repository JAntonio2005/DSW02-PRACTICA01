package com.dsw02.practica01.common.web;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
        Instant timestamp,
        String code,
        String message,
        Map<String, String> fieldErrors
) {
}
