# 强制删除public文件夹，不管是否被占用
function Delete-ForcePublic {
    param (
        [string]$path = "public"
    )

    $publicPath = Join-Path -Path $PWD -ChildPath $path

    if (Test-Path $publicPath) {
        Remove-Item -Path $publicPath -Recurse -Force
        Write-Host "已强制删除 $publicPath"
    } else {
        Write-Host "$publicPath 不存在，无需删除"
    }
}

Delete-ForcePublic