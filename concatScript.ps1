param(
	[string]$baseDir = 'src',
	[string]$outPath = 'dist/dist.js'
)
$userscriptBasePath = Join-Path -Path  $baseDir  -ChildPath userscriptHead
$indexPath = Join-Path -Path $baseDir -ChildPath index.js
npx tsc 
$userscriptBase = Get-Content -Path   $userscriptBasePath
$index = Get-Content -Path $indexPath
$outJS = $userscriptBase + "`n" + $index
Out-File -FilePath $outPath -Encoding utf8 -InputObject $outJS

Remove-Item $indexPath

Get-Content -Path dist/dist.js | Set-Clipboard