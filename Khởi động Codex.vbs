Set WshShell = CreateObject("WScript.Shell")
Set FSO = CreateObject("Scripting.FileSystemObject")
currentDir = FSO.GetParentFolderName(WScript.ScriptFullName)
WshShell.CurrentDirectory = currentDir

If FSO.FileExists(currentDir & "\dist\Codex.exe") Then
    WshShell.Run Chr(34) & currentDir & "\dist\Codex.exe" & Chr(34), 0, False
Else
    WshShell.Run "node " & Chr(34) & currentDir & "\extension\run-windows.mjs" & Chr(34), 0, False
End If
