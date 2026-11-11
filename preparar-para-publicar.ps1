# Prepara la página de Teté para publicarla en internet.
# Convierte las rutas de la vista previa (al compartir) en direcciones completas, que es lo que exigen
# WhatsApp, Facebook e Instagram. Uso:  .\preparar-para-publicar.ps1 -Sitio "https://tete.cl"
param([Parameter(Mandatory=$true)][string]$Sitio)
$Sitio = $Sitio.TrimEnd('/')
$enc = New-Object Text.UTF8Encoding $false
foreach ($f in @("$PSScriptRoot\index.html", "$PSScriptRoot\index-ovillo.html")) {
  if (-not (Test-Path $f)) { continue }
  $t = [IO.File]::ReadAllText($f)
  $t = [regex]::Replace($t, '(<meta (?:property="og:image"|name="twitter:image") content=")(?:https?://[^/"]+/)?(img/[^"]+")', "`${1}$Sitio/`$2")
  $t = [regex]::Replace($t, '\s*<meta property="og:url"[^>]*>\s*<link rel="canonical"[^>]*>', '')
  $pagina = if ($f -like '*index.html') { "$Sitio/" } else { "$Sitio/" + (Split-Path $f -Leaf) }
  $t = $t.Replace('<meta property="og:type" content="website">', "<meta property=`"og:type`" content=`"website`">`n<meta property=`"og:url`" content=`"$pagina`">`n<link rel=`"canonical`" href=`"$pagina`">")
  [IO.File]::WriteAllText($f, $t, $enc)
  Write-Host "Listo: $(Split-Path $f -Leaf) -> $pagina"
}
Write-Host "Ahora sube la carpeta tete-web completa a tu hosting y prueba el link en https://developers.facebook.com/tools/debug/"
