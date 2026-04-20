param(
    [int]$Iterations = 20,
    [string]$BaseUrl = "http://localhost",
    [string]$ComposeFile = "docker/docker-compose.yml",
    [string]$EvidencePath = "specs/006-nginx-proxy-compose/evidence/sc-002-results.json"
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot "../.."))

function Get-StatusCode {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = "",
        [hashtable]$Headers = @{}
    )

    try {
        if ($Method -in @("POST", "PUT", "PATCH")) {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -Body $Body -ContentType "application/json" -TimeoutSec 10 -UseBasicParsing
        }
        else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Headers $Headers -TimeoutSec 10 -UseBasicParsing
        }
        return [int]$response.StatusCode
    }
    catch {
        if ($_.Exception.Response -and $_.Exception.Response.StatusCode) {
            return [int]$_.Exception.Response.StatusCode
        }
        return 0
    }
}

function Test-HostPortBlocked {
    param(
        [string]$Service,
        [string]$ComposeFile
    )

    $lines = docker compose -f $ComposeFile ps --format json
    if ($LASTEXITCODE -ne 0) {
        return $false
    }

    $serviceEntry = $null
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) {
            continue
        }

        $obj = $line | ConvertFrom-Json
        if ($obj.Service -eq $Service) {
            $serviceEntry = $obj
            break
        }
    }

    if ($null -eq $serviceEntry) {
        return $false
    }

    $publishers = @($serviceEntry.Publishers)
    if ($publishers.Count -eq 0) {
        return $true
    }

    foreach ($publisher in $publishers) {
        if ($publisher.PublishedPort -ne 0) {
            return $false
        }
    }

    return $true
}

docker compose -f $ComposeFile up -d --build | Out-Null

# Wait for proxy and upstreams to stabilize before iteration loop.
$warmupDeadline = (Get-Date).AddMinutes(3)
do {
    $rootWarmup = Get-StatusCode -Url "$BaseUrl/"
    $apiWarmup = Get-StatusCode -Url "$BaseUrl/api/auth/login" -Method "POST" -Body '{"correo":"admin@empresa.com","password":"admin123"}'
    $ready = ($rootWarmup -ge 200 -and $rootWarmup -lt 500) -and ($apiWarmup -ge 200 -and $apiWarmup -lt 500)
    if (-not $ready) {
        Start-Sleep -Seconds 2
    }
} while (-not $ready -and (Get-Date) -lt $warmupDeadline)

$results = @()
$successCount = 0

for ($i = 1; $i -le $Iterations; $i++) {
    $rootCode = Get-StatusCode -Url "$BaseUrl/"
    $apiCode = Get-StatusCode -Url "$BaseUrl/api/auth/login" -Method "POST" -Body '{"correo":"admin@empresa.com","password":"admin123"}'
    $frontendBlocked = Test-HostPortBlocked -Service "frontend" -ComposeFile $ComposeFile
    $backendBlocked = Test-HostPortBlocked -Service "app" -ComposeFile $ComposeFile

    $rootOk = $rootCode -ge 200 -and $rootCode -lt 500
    $apiOk = $apiCode -ge 200 -and $apiCode -lt 500
    $blockedOk = $frontendBlocked -and $backendBlocked
    $passed = $rootOk -and $apiOk -and $blockedOk

    if ($passed) {
        $successCount++
    }

    $results += [pscustomobject]@{
        iteration = $i
        rootStatus = $rootCode
        apiStatus = $apiCode
        frontendHostBlocked = $frontendBlocked
        backendHostBlocked = $backendBlocked
        passed = $passed
    }
}

$successRate = [Math]::Round(($successCount / [double]$Iterations) * 100, 2)

$payload = [pscustomobject]@{
    timestamp = (Get-Date).ToString("o")
    iterations = $Iterations
    successCount = $successCount
    successRate = $successRate
    thresholdPercent = 95
    passed = ($successRate -ge 95)
    composeFile = $ComposeFile
    baseUrl = $BaseUrl
    checks = @("GET /", "POST /api/auth/login", "frontend service not published to host", "app service not published to host")
    results = $results
}

$evidenceDir = Split-Path -Parent $EvidencePath
if (!(Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -Path $EvidencePath -Encoding UTF8
Write-Output ("SC-002 success rate: {0}% ({1}/{2})" -f $successRate, $successCount, $Iterations)
Write-Output ("Evidence: {0}" -f $EvidencePath)

if ($successRate -lt 95) {
    exit 1
}
