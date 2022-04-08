using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text;
using mdns_api.Models;

namespace mdns_api.Controllers {
    [Route("api/stages")]
    [ApiController]
    public class StageController : ControllerBase {

        private static readonly Random r = new();
        public static readonly SortedDictionary<string, Stage> stages = new();

        [HttpGet("get/{name}")]
        public async Task<ActionResult<Stage>> GetByName(string name) {
            name = name.Replace(' ', '_').Replace("%20", "_");
            if(!stages.ContainsKey(name)) {
                HttpClient client = new();
                Stage stage = new() {
                    Name = System.Web.HttpUtility.UrlDecode(name),
                    DownloadUrl = $"https://{Request.Host}/api/stages/asfile/{System.Web.HttpUtility.UrlDecode(name).Replace(' ', '_').Replace("%20", "_")}.rad",
                };
                // code
                string code = await Utils.GetPublishedCode("tracks", name);
                if(code.Length > 0) {
                    stage.Code = code;
                    foreach(string line in code.Split('\n')) {
                        if(line.StartsWith("soundtrack(")) {
                            string[] stData = line.Split('(', ')')[1].Split(',');
                            stage.Soundtrack = stData[0];
                            stage.SoundtrackUrl = $"http://multiplayer.needformadness.com/tracks/music/{System.Web.HttpUtility.UrlEncode(stData[0].Split('.')[0].Replace(' ', '_').Replace("%20", "_"))}.zip";
                            _ = int.TryParse(stData[1], out int vol);
                            _ = int.TryParse(stData[2], out int size);
                            stage.SoundtrackVolume = vol;
                            stage.SoundtrackSize = size;
                            break;
                        }
                    }
                }
                else return NotFound();
                // other properties
                string detailsraw = await Utils.GetText($"http://multiplayer.needformadness.com/tracks/{name}.txt", Encoding.Latin1);
                if(detailsraw.Contains("details(")) {
                    string[] details = detailsraw.Split('(', ')')[1].Split(',');
                    stage.Publisher = details[0];
                    stage.PublishType = Convert.ToByte(details[1]);
                    stage.AddedBy = details.Skip(2).ToList();
                    if(detailsraw.Contains("Clan#")) {
                        stage.ClanProperty = true;
                        stage.ClanName = stage.AddedBy.FirstOrDefault(f => f.StartsWith("Clan#"), "#").Split('#')[1];
                    }
                }
                // return and cache the stage
                stages.Add(name, stage);
                return Ok(stage);
            }
            return Ok(stages[name]);
        }
        [HttpGet("asfile/{name}.{extension}")]
        public async Task<ActionResult<string>> GetAsFile(string name, string extension = "rad") {
            name = name.Replace(' ', '_').Replace("%20", "_");
            byte[] code = await Utils.GetPublishedCodeByteArray("tracks", name);
            if(code.Length > 0) {
                byte[] data = await Utils.GetByteArray($"http://multiplayer.needformadness.com/tracks/{name}.txt");
                byte[] result = new byte[code.Length + data.Length];
                Buffer.BlockCopy(code, 0, result, 0, code.Length);
                Buffer.BlockCopy(data, 0, result, code.Length, data.Length);
                return File(result, "text/plain", $"{name}.{extension}");
            }
            else return NotFound();
        }
    }
}
