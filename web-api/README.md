# WEB-API

### How to use
1. Make sure that [.NET 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) is installed.
2. Make sure that the necessary NuGet packages are present (see below), or run `install-dotnet-packages.bat` to try installing the missing ones.
3. Start the app:
   - Use `run-web-api.bat` to build and run it.
   - Build it manually (see below).
   - Start it from an IDE.

4. Always look at the port in the console window, it may not be 7041:
```
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: https://localhost:7041
    info: Microsoft.Hosting.Lifetime[14]
          Now listening on: http://localhost:5041
```

5. To interact with the API, send HTTP requests to the proper paths:
   - Discover them by using Swagger (`localhost:7041/swagger/`), where you can directly test them too.
   - See the brief documentation below, and use a tool like [Postman (desktop app)](https://www.postman.com/downloads/), or [Insomnia REST](https://insomnia.rest/download).
   - Or do it with JavaScript using the [Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API).
   - With [curl](https://flaviocopes.com/http-curl/) through the command line.
   - If a path doesn't expect anything in the request body, just type it into a browser's address bar, like `https://localhost:7041/api/misc/top20`.

### Paths
Always replace `{param}` with a value, without the curly braces.

- **Car**
   - `[GET] /api/cars/get/{name}` Returns a stringified JSON object containing details about the car with the original text, or 404.
   - `[GET] /api/cars/asfile/{name}.{extension}` Returns a file with the original text inside, with details appended to the end, or 404. Only a few milliseconds faster though than `/get/{name}`.
- **Clan**
   - `[GET] /api/clans/get/{name}` Returns a stringified JSON object containing data about a clan, or 404.
- **Misc**
   - `[GET] /api/misc/top20` Return a stringified JSON object with all the different Top 20 leaderboards.
- **Profile**
   - `[GET] /api/profiles/get/{name}` Return a stringified JSON object with details about the profile, or 404.
- **Stage**
   - `[GET] /api/stages/get/{name}` Returns a stringified JSON object containing details about the stage with the original text, or 404.
   - `[GET] /api/stages/asfile/{name}.{extension}` Returns a file with the original text inside, with details appended to the end, or 404. Only a few milliseconds faster though than `/get/{name}`.

### Dependencies
| Source | Description | Installation |
| ------ | ------ | ------ |
| [.NET 6 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/6.0) | To build and run the app. | Click on the correct binary, then follow the instructions on the page after that. |
| [SharpZipLib NuGet package](https://www.nuget.org/packages/SharpZipLib/) | To work with compressed files. | Run the dotnet command `dotnet add package SharpZipLib`, or through Visual Studio: **Project > Manage NuGet Packages > Browse > search "sharpziplib" > Install** |

### How to build/run
To manually **build and run** the app, use the included `run_web-api.bat`, or by using the dotnet commands:

**Build,Run**: `dotnet run --project <path-to-app>`
**Build**: `dotnet build --project <path-to-app>`
**Publish**: `dotnet publish --project <path-to-app>`

The **\<path-to-app\>** should be a path to the directory containing the csproj file. The **--project \<path-to-app\>** is not needed when the command is run next to the csproj file.
Or press `F5` in Visual Studio to Build,Run,Debug, and `Ctrl+B` to just Build.
The resulting binary should be in `\bin\Debug\net6.0\`.
