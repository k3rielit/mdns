using mdns_api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Text;
using Swashbuckle.AspNetCore.Annotations;

namespace mdns_api.Controllers {
    [Route("api/profiles")]
    [ApiController]
    public class ProfileController : ControllerBase {
        private static readonly Random r = new Random();
        public static readonly SortedDictionary<string,Profile> profiles = new();

        [HttpGet]
        public async Task<ActionResult<IEnumerable<string>>> GetNames() {
            return Ok(profiles.Select(s => s.Key));
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<Profile>>> GetAll() {
            return Ok(profiles.Values);
        }

        [HttpGet("count")]
        public async Task<ActionResult<int>> GetCount() {
            return Ok(profiles.Count);
        }

        [HttpGet("random")]
        public async Task<ActionResult<Profile>> GetRandom() {
            return Ok(profiles.Count > 0 ? profiles.ElementAt(r.Next(0, profiles.Count)).Value : new Profile());
        }

        [HttpGet("stats")]
        public async Task<ActionResult<IEnumerable<object>>> GetStats() {
            return Ok(new {
                profiles.Count,
                Names = profiles.Select(s => s.Value.Name),
                Racing = profiles.Select(p => p.Value.Racing).Sum(),
                Wasting = profiles.Select(p => p.Value.Wasting).Sum(),
                Cars = profiles.Select(p => p.Value.Cars).SelectMany(c => c).ToList().Distinct().OrderBy(o => o),
                Stages = profiles.Select(p => p.Value.Stages).SelectMany(s => s).ToList().Distinct().OrderBy(o => o),
            });
        }

        [HttpGet("get/{name}")]
        public async Task<ActionResult<Profile>> GetByName(string name) {
            if(!profiles.ContainsKey(name)) {
                HttpClient client = new();
                Profile profile = new() {
                    Name = System.Web.HttpUtility.UrlDecode(name),
                };
                // logo, avatar check
                string logoUrl = $"http://multiplayer.needformadness.com/profiles/{name}/logo.png";
                string avatarUrl = $"http://multiplayer.needformadness.com/profiles/{name}/avatar.png";
                profile.Logo = await Utils.RemoteFileExists(logoUrl) ? logoUrl : "";
                profile.Avatar = await Utils.RemoteFileExists(avatarUrl) ? logoUrl : "";
                // cars
                string carlist = await Utils.GetText($"http://multiplayer.needformadness.com/cars/lists/{name}.txt", Encoding.Latin1);
                profile.Cars = carlist.Contains("mycars(") ? carlist.Split('(', ')')[1].Split(',').ToList() : profile.Cars;
                // stages
                string stagelist = await Utils.GetText($"http://multiplayer.needformadness.com/tracks/lists/{name}.txt", Encoding.Latin1);
                profile.Stages = stagelist.Contains("mystages(") ? stagelist.Split('(', ')')[1].Split(',').ToList() : profile.Stages;
                // friend list
                string friendlist = await Utils.GetText($"http://multiplayer.needformadness.com/profiles/{name}/friends.txt", Encoding.Latin1);
                profile.Friends = friendlist.Contains('|') ? friendlist.Split("\r\n")[0].Split('|').Where(w => w.Length > 0).ToList() : profile.Friends;
                // info.txt
                try {
                    HttpResponseMessage response = await client.GetAsync($"http://multiplayer.needformadness.com/profiles/{name}/info.txt");
                    response.EnsureSuccessStatusCode();
                    byte[] responseBody = await response.Content.ReadAsByteArrayAsync();
                    string[] lines = Encoding.Latin1.GetString(responseBody).Split("\r\n");
                    profile.ThemeSong = lines[0].Length > 0 ? $"http://multiplayer.needformadness.com/tracks/music/{lines[0]}.zip" : profile.ThemeSong;
                    profile.ThemeSongName = lines[0].Length > 0 ? lines[0] : profile.ThemeSongName;
                    profile.TrackVol = lines[1].Length > 0 ? int.Parse(lines[1]) : profile.TrackVol;
                    profile.Racing = lines[2].Length > 0 ? int.Parse(lines[2]) : profile.Racing;
                    profile.Wasting = lines[3].Length > 0 ? int.Parse(lines[3]) : profile.Wasting;
                    profile.ClanName = lines[4].Length > 0 ? lines[4] : profile.ClanName;
                    profile.ClanLogo = lines[4].Length > 0 ? $"http://multiplayer.needformadness.com/clans/{lines[4]}/logo.png" : profile.ClanLogo;
                    profile.Description = lines[8].Length > 0 ? lines[8] : profile.Description;
                }
                catch(Exception) {
                    if(profile.Cars.Count==0 && profile.Stages.Count==0 && profile.Friends.Count==0 && profile.Avatar=="" && profile.Logo=="") {
                        return NotFound(); // if no data could be retrieved, the profile is empty, trial, or doesn't exist
                    }
                }
                // return the final profile, and save it to speed up future API calls
                profiles.Add(name,profile);
                return Ok(profile);
            }
            return Ok(profiles[name]);
        }
    }
}
