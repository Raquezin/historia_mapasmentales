$markdownDir = "."
Get-ChildItem -Path $markdownDir -Filter "*.md" -File | ForEach-Object {
    $pdfDir = Join-Path (Split-Path $_.DirectoryName) "pdf"
    if (-not (Test-Path $pdfDir)) {
        New-Item -Path $pdfDir -ItemType Directory | Out-Null
    }
    $pdfFile = Join-Path $pdfDir ($_.BaseName + ".pdf")
    Write-Output "Procesando: $($_.FullName)"
    pandoc $($_.FullName) --from=gfm -o $pdfFile -V geometry:margin=0.7in
    Write-Output "Generado: $pdfFile"
}
