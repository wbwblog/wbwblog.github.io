# ǿ��ɾ��public�ļ��У������Ƿ�ռ��
function Delete-ForcePublic {
    param (
        [string]$path = "public"
    )

    $publicPath = Join-Path -Path $PWD -ChildPath $path

    if (Test-Path $publicPath) {
        Remove-Item -Path $publicPath -Recurse -Force
        Write-Host "��ǿ��ɾ�� $publicPath"
    } else {
        Write-Host "$publicPath �����ڣ�����ɾ��"
    }
}

Delete-ForcePublic