<#
.SYNOPSIS
    Prepare la configuration Render du backend DCS Dental.

.DESCRIPTION
    Recupere la vraie chaine de connexion Neon (pooled + SSL), ecrit le fichier
    backend\.env.render a copier dans Render et met DATABASE_URL dans le
    presse-papiers. Aucun secret n'est affiche a l'ecran.

.EXAMPLE
    .\scripts\prepare_render_env.ps1
    .\scripts\prepare_render_env.ps1 -Branch production
#>
param(
    [string]$Branch = 'production'
)

$ErrorActionPreference = 'Stop'

$backendDir = Split-Path -Parent $PSScriptRoot
$envFile = Join-Path $backendDir '.env.render'
$secretFile = Join-Path $backendDir '.env'

Write-Host "Branche Neon : $Branch"

$databaseUrl = (neon connection-string $Branch --pooled --ssl require | Out-String).Trim()
if (-not $databaseUrl.StartsWith('postgresql://') -and -not $databaseUrl.StartsWith('postgres://')) {
    throw "Impossible de recuperer la chaine de connexion Neon (reponse: $databaseUrl). Lancez 'neon auth' puis reessayez."
}
if ($databaseUrl -match 'xxxx|<region>') {
    throw "La chaine de connexion contient encore un placeholder. Verifiez le projet/lien Neon."
}

# Reutilise la cle secrete existante pour ne pas invalider les sessions.
$secretKey = $null
foreach ($candidate in @($secretFile, (Join-Path $backendDir '.env.bak-neon'))) {
    if (Test-Path $candidate) {
        $line = Get-Content $candidate | Where-Object { $_ -match '^DJANGO_SECRET_KEY=' } | Select-Object -First 1
        if ($line) {
            $secretKey = ($line -replace '^DJANGO_SECRET_KEY=', '').Trim().Trim('"').Trim("'")
            break
        }
    }
}
if (-not $secretKey) {
    $bytes = New-Object byte[] 48
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($bytes)
    $secretKey = [Convert]::ToBase64String($bytes)
    Write-Host "Nouvelle DJANGO_SECRET_KEY generee (les sessions existantes seront invalidees)."
}

$content = @(
    '# Render > Environment > Secret File ".env" (monte sur /etc/secrets/.env)',
    'DJANGO_SETTINGS_MODULE=config.settings.production',
    "DJANGO_SECRET_KEY=$secretKey",
    'DJANGO_DEBUG=False',
    'DJANGO_ALLOWED_HOSTS=.onrender.com',
    'CORS_ALLOWED_ORIGINS=http://localhost:3000',
    "DATABASE_URL=$databaseUrl"
)

[System.IO.File]::WriteAllLines($envFile, $content, (New-Object System.Text.UTF8Encoding($false)))

try {
    Set-Clipboard -Value $databaseUrl
    $clipboard = 'oui (collez directement dans Render)'
} catch {
    $clipboard = 'non (copiez la ligne DATABASE_URL du fichier)'
}

$host_ = ([System.Uri]$databaseUrl).Host
Write-Host ''
Write-Host "Fichier pret   : $envFile"
Write-Host "Hote Neon      : ep-***-pooler...aws.neon.tech (pooled, sslmode=require)"
Write-Host "Presse-papiers : $clipboard"
Write-Host ''
Write-Host 'Etapes Render :'
Write-Host '  1. Environment Variables : DATABASE_URL = (coller)  <- present au build'
Write-Host '  2. Environment Variables : supprimer DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD'
Write-Host '  3. Secret File .env      : coller le contenu de .env.render (runtime uniquement)'
Write-Host '  4. Manual Deploy > Clear build cache & deploy'
