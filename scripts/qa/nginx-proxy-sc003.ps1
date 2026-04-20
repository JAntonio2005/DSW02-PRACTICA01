param(
    [int]$Runs = 3,
    [int]$ThresholdSeconds = 300,
    [string]$ComposeFile = "docker/docker-compose.yml",
    [string]$BaseUrl = "http://localhost",
    [string]$EvidencePath = "specs/006-nginx-proxy-compose/evidence/sc-003-timing.json"
)

$ErrorActionPreference = "Stop"
Set-Location (Resolve-Path (Join-Path $PSScriptRoot "../.."))

function Get-StatusCode {
    param(
        [string]$Url,
        [string]$Method = "GET",
        [string]$Body = ""
    )

    try {
        if ($Method -in @("POST", "PUT", "PATCH")) {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -Body $Body -ContentType "application/json" -TimeoutSec 10 -UseBasicParsing
        }
        else {
            $response = Invoke-WebRequest -Uri $Url -Method $Method -TimeoutSec 10 -UseBasicParsing
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

function Wait-For-MinimumValidation {
    param(
        [string]$Url,
        [int]$TimeoutSeconds = 300
    )

    $start = Get-Date
    do {
        $rootCode = Get-StatusCode -Url "$Url/" -Method "GET"
        $apiCode = Get-StatusCode -Url "$Url/api/auth/login" -Method "POST" -Body '{"correo":"admin@empresa.com","password":"admin123"}'

        if ($rootCode -ge 200 -and $rootCode -lt 500 -and $apiCode -ge 200 -and $apiCode -lt 500) {
            return $true
        }

        Start-Sleep -Seconds 2
    } while (((Get-Date) - $start).TotalSeconds -lt $TimeoutSeconds)

    return $false
}

$runResults = @()
$allPassed = $true

for ($run = 1; $run -le $Runs; $run++) {
    docker compose -f $ComposeFile down | Out-Null

    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    docker compose -f $ComposeFile up -d --build | Out-Null

    $validated = Wait-For-MinimumValidation -Url $BaseUrl -TimeoutSeconds $ThresholdSeconds
    $sw.Stop()

    $elapsed = [Math]::Round($sw.Elapsed.TotalSeconds, 2)
    $withinThreshold = $validated -and ($elapsed -le $ThresholdSeconds)
    if (-not $withinThreshold) {
        $allPassed = $false
    }

    $runResults += [pscustomobject]@{
        run = $run
        elapsedSeconds = $elapsed
        thresholdSeconds = $ThresholdSeconds
        validated = $validated
        withinThreshold = $withinThreshold
    }
}

$payload = [pscustomobject]@{
    timestamp = (Get-Date).ToString("o")
    runs = $Runs
    thresholdSeconds = $ThresholdSeconds
    passed = $allPassed
    composeFile = $ComposeFile
    baseUrl = $BaseUrl
    definition = "Tiempo total desde 'docker compose up -d --build' hasta validacion funcional minima exitosa"
    results = $runResults
}

$evidenceDir = Split-Path -Parent $EvidencePath
if (!(Test-Path $evidenceDir)) {
    New-Item -ItemType Directory -Path $evidenceDir -Force | Out-Null
}

$payload | ConvertTo-Json -Depth 6 | Set-Content -Path $EvidencePath -Encoding UTF8
Write-Output ("SC-003 runs completed. Evidence: {0}" -f $EvidencePath)

if (-not $allPassed) {
    exit 1
}
