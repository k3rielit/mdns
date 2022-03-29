# WEB-API
### Dependencies
| Source | Description | Installation |
| ------ | ------ | ------ |
| [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) | To build and run the app. | Click on the correct binary, then follow the instructions on the page after that. |
| [SharpZipLib NuGet package](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) | To work with compressed files inside the app. | Run the dotnet command `dotnet add package SharpZipLib`, or through Visual Studio: **Project > Manage NuGet Packages > Browse > search "sharpziplib" > Install** |
### How to build/run
To manually **build and run** the app, use the included `run_web-api.bat`, or manually type in the dotnet command into a command line:
```sh
dotnet run --project <path-to-app>
```
To just **build**:
```sh
dotnet run --project <path-to-app>
```
The **--project <path-to-app>** should be a path to the directory containing the csproj file. Not needed when the command is run next to the csproj file.
Or press `F5` in Visual Studio to Build,Run,Debug, and `Ctrl+B to` just Build.
The resulting binary should be in `\bin\Debug\net6.0\`.